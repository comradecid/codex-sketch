
/*

DATA-PROCESSING RESOURCES


TO DO

*** - Replace getLayerJSON with improved method from API
- Determine which functions need to be exported, and which can stay private
- Add in optional file overwrite confirmation check for writeDataToFile
- Add in error catch if we don't have a valid string to write to file for 
  writeDataToFile?
- Determine which functions need to be exported, and which can stay private

*/

// Other constants
const OUTPUT_FILENAME = 'codex_output.json';

// Sketch API for gathering information about document items
//import * as DOM from 'sketch/dom';
var document = require('sketch/dom').getSelectedDocument();
//const document = Document.getSelectedDocument();

import {
  message
} from './ui.js';

// Other constants
const LAYER_TYPE_SYMBOL_INSTANCE = 'MSSymbolInstance';
const LAYER_TYPE_SYMBOL_MASTER = 'MSSymbolMaster';

// TODO: Get rid of these?
let syncSymbols = [];
let useSymbolNames = [];
let ignoreSymbolNames = [];

// TMP
let useIgnoreFlag = true;
let ignoreFlag = '#';

/* ---- */


/** Get sync data for selected layers
	  [!] Performs basic variable checks, but does not validate
    @param {object} context - Current Sketch context
    @return {object} — Array containing non-undefined values for the following:
      1) Processed/consolidated JSON data to send to server
      2) List of names of symbols to be synced
      3) List of names of symbols that will be 'ignored'
*/
export function processSelection() {

  let selection = document.selectedLayers;
  let processedSelection = {};

  // If user has selected at least one item...
  if (selection.length > 0) {

    // Traverse selected layer(s) to gather symbol information
    selection.forEach(( layer ) => { 
      
      processLayer(layer);
    });

    return processedSelection;

  // User hasn't selected anything
  } else {
    
    message(uiStrings.MSG_SELECT_SYMBOL);
    return null;
  }
}


/* ---- */


/** Local utility function: process symbol for possible sync with style guide
*/
// If this layer is a symbol master, recurse through it and grab any other
// children that are dependent symbols
// If this layer is a symbol instance, grab its master and use that for 
// recursive examination
function processLayer( layer ) {
	    
  let layerClass = layer.sketchObject.className();
  
  // If this is a symbol...
  if ((layerClass == LAYER_TYPE_SYMBOL_INSTANCE) || 
  	  (layerClass == LAYER_TYPE_SYMBOL_MASTER)) {

		// Get name of symbol first, to determine if it should be ignored
		let layerName = String(layer.sketchObject.name());

		// Get JSON for selected symbol
		// If name includes ignore flag, ignore it; otherwise, ready it for sync
		let jsonData = getLayerJSON(layer);

		// If 'ignore' flag is found, add this to the 'ignore' list
		if (useIgnoreFlag && (0 === (layerName.indexOf(ignoreFlag)))) {
			
			ignoreSymbolNames.push(layerName);
			jsonData.ignore = true;
		
		} else {
			
			useSymbolNames.push(layerName);
		}
		
		// Add symbol to the sync list
		syncSymbols.push(jsonData);
  }
}


/* ---- */
  

/** Get corresponding JSON data for layer object
	  [!] Performs basic variable checks, but does not validate
    @param {object} layer - Layer object to process
    @return {object} JSON object
*/
function getLayerJSON( layer ) {

	if (layer !== undefined) {
	
		try {
			
			let dict = layer.sketchObject.treeAsDictionary();
			let jsonData = NSJSONSerialization.dataWithJSONObject_options_error_(dict, 0, nil);
			let jsonString = NSString.alloc().initWithData_encoding_(jsonData, NSUTF8StringEncoding);
			
			return JSON.parse(jsonString);
			
		} catch(error) {

			console.log(uiStrings.CONSOLE_ERR_PRFX + error);
		}

	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_LAYER_NULL);
	}
}


/* ---- */


/** Get parent directory for this plugin (usually the Sketch plugin directory)
    In this plugin, this is typically used to determine storage location for 
    user config file
	  [!] If you're using an alias to point to your plugin, results may vary!
    @param {object} context — Current context
    @return {string} Path of parent dir
*/
export function getPluginsDir( context ) {

	if (context !== undefined) {
		
		let path = context.scriptPath.stringByDeletingLastPathComponent();
		let parts = path.split('/');
		
		let numParts = parts.length - 3; // -3 parts to tunnel out of plugin itself
		path = '';
		
		for (let i = 1; i < numParts; i++) {
			
			path += '/' + parts[i];
		}
		
		return path + '/';
		
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + 'Missing context');
	}
}


/* ---- */


/** Strip file prefix from path string; used to make filepath captured from OS 
    dialogs usable by other processes
	  [!] Performs basic variable checks, but does not validate
    @param {string} path - Path to clean up
    @return {string} Cleaned-up path
*/
export function formatFilePath( path ) {

	if (path !== undefined) {
	
	  path = path.toString();
		return (0 === path.indexOf("file://")) ? 
			path.substring(7) : path;
	
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_FILEPATH_NULL);
	}
}


/* ---- */


/** Write JSON data (in string format) to target file
	  [!] Performs basic variable checks, but does not validate
	  [!] Will overwrite target file if it already exists!
    @param {string} data - JSON data to write; stringifies as needed
    @param {string} path - Filepath to write to
*/
export function writeDataToFile( data, path, filename ) {

	if ((data !== undefined) && 
		  (path !== undefined) && (filename !== undefined)) {

		// Double-check value just in case it got munged due to eval
		if ((typeof data) === 'object') {

			data += '';
		}

		// We need to write a string to the file; if we have one, proceed
		if ((typeof data) === 'string') {

			// Format content string and path
			let content = 
				NSString.stringWithString(data);
			let formattedContent = 
				NSString.stringWithFormat("%@", content);
			let formattedPath = 
				NSString.stringWithFormat("%@", path + filename);

			// Write to file
			formattedContent.writeToFile_atomically_encoding_error(
				formattedPath, true, NSUTF8StringEncoding, null);
		}
	
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_DATAWRITE_NULL);
	}
}


/* ---- */


/** Read JSON data from target file
	  [!] Performs basic variable checks, but does not validate
	  [!] Will return empty object if file does not exist!
    @param {string} path - Filepath to write to
    @return {object} — File contents
*/
export function readDataFromFile( path ) {
	
	if (path !== undefined) {
		
		try {

			let formattedPath = 
				NSString.stringWithFormat("%@", path);
			return NSString.stringWithContentsOfFile_encoding_error(
				formattedPath, NSUTF8StringEncoding, null);

		} catch(error) {

			console.log(uiStrings.CONSOLE_ERR_PRFX + error);
		}
		
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + 'Missing path');
	}
}
