
/*

DATA-PROCESSING RESOURCES


TO DO

*** - Replace getLayerJSON with improved method from API
- Determine which functions need to be exported, and which can stay private

*/


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
