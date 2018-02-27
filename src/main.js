/*

WORKING WITH THIS PLUGIN

Much of the underlying Sketch API is undocumented, only partially exposes 
underlying functionality, and/or is totally reliant on working with some form 
of cocoascript. As such, any modifications should be made cautiously, and with 
the understanding that any changes by the Sketch team between app versions may 
break this plugin code.

More info:
http://developer.sketchapp.com/examples/plugins/resources


AVOID COCOASCRIPT

If you need to insert cocoascript anywhere, refer to this document for instead 
converting it to JS: http://developer.sketchapp.com/guides/cocoascript

Doing so helps prevent build errors with the Sketch Plugin Manager 
(https://github.com/skpm) — at present, it can't compile cocoascript — and makes
this code more accessible to other contributors, whilst still allowing us to 
access important AppKit functionality.


DEBUGGING

This plugin includes very basic reporting to console in case of common errors, 
and also has a 'DEBUG' flag, which when set to true dumps the JSON output to a 
local file instead attempting to push it to the database.

Other common tools and techniques are available elsewhere. More info: 
http://developer.sketchapp.com/guides/debugging-plugins
https://medium.com/@bomberstudios/debugging-sketch-plugins-e134b14ee22
https://medium.com/@marianomike/the-beginners-guide-to-writing-sketch-plugins-part-1-28a5e3f01c68

*/


import { 
	dumpToOutputFile, getConfirmation, showMessage, 
	MSG_SELECT_SYMBOL
} from './ui.js';

import { 
	getLayerJSON
} from './data.js';


// Debugging
const DEBUG = true;


/* ---- */


/**
 *  Primary parsing + syncing function
 *  - Checks for selected symbols
 *  - Traverses selected symbols contents recursively for sub-symbols
 *  - Assembles syncable information into JSON set
 *  - Delivers JSON to server for further processing
 */
export default function (context) {

	// Identifiers
	const LAYER_TYPE_SYMBOL_INSTANCE = 'MSSymbolInstance';
	const LAYER_TYPE_SYMBOL_MASTER = 'MSSymbolMaster';
	const SYMBOL_IGNORE_FLAG = '#';

	// Main sketch objects and other resources
	const sketch = context.api();
  const selectedLayers = sketch.selectedDocument.selectedPage.selectedLayers;	
  
  // Containers to hold selected symbols
  const syncSymbols = [];
  const ignoreSymbolNames = [];
  
  /* ---- */

	// If this layer is a symbol master, recurse through it and grab any other
	// children that are dependent symbols
	// If this layer is a symbol instance, grab its master and use that for 
	// recursive examination
	// TODO: How do we deal with local overrides?
  function processLayer( layer ) {
		    
    let layerClass = layer.sketchObject.className();
    
    // If this is a symbol...
    // TODO: handle diffs between instances and masters
    // TODO: Recurse this!
    if ((layerClass == LAYER_TYPE_SYMBOL_INSTANCE) || 
    	  (layerClass == LAYER_TYPE_SYMBOL_MASTER)) {

			// Get name of symbol first, to determine if it should be ignored
			let layerName = String(layer.sketchObject.name());

			// Get JSON for selected symbol
			// If name includes ignore flag, ignore it; otherwise, ready it for sync
			// TODO: Non-JSON formatting of symbols collection info can lead to parse errors
			let jsonString = getLayerJSON(layer);

/*
		  for (let i in symbols) {
		  
		  	// Parse stringified JSON back into real JSON, 
		  	// both to read values and allow for file dump later
		  	// TODO: Possibly hide actual symbol names, and move this to debug
		    symbols[i] = JSON.parse(symbols[i]);
				name = symbols[i].name;
				
				// If 'ignore' flag is found, add this to the 'ignore' list
				if (0 === (name.indexOf(SYMBOL_IGNORE_FLAG))) {
					
					ignoreList.push(symbols[i].name);
				
				} else {
	
					message += (i > 0) ? LBL_LINEITEM : '';
					message += symbols[i].name;
				}
		  }
		  
		  numIgnores = ignoreList.length;
		  if (numIgnores > 0) {
			  
			  message += '\n\n' + MSG_CONFIRM_IGNORE + '\n\n';
			  
			  for (let i in ignoreList) {
				  
				  message += (i > 0) ? LBL_LINEITEM : '';
					message += ignoreList[i];
			  }
		  }
*/

			// TODO: Re-account for ignored items
			syncSymbols.push(jsonString);
			ignoreSymbolNames.push(layerName);
    }
  }

  /* ---- */
  
  // If user has selected at least one item...
  if (selectedLayers.length > 0) {

		// Traverse selected layer(s) to gather symbol information
		selectedLayers.iterate((layer) => { processLayer(layer); });
		
		// If we have symbols to sync, proceed; 
		// if not, we risk errors when syncing/dumping the data
		let numSymbols = syncSymbols.length;

		if (numSymbols > 0) {

			// Load confirmation dialog, capturing response from user
			let confirmed = getConfirmation(sketch, syncSymbols, ignoreSymbolNames);
	    
	    // If user has opted to continue...
	    if (confirmed) {
		  
				// Debug: dump JSON to file, instead of pushing to server
				if (DEBUG) {
		
					dumpToOutputFile(syncSymbols);
				
				} else {
					
					// Push it to server
				}

			// User cancelled sync
	    } else {
		  
		    showMessage(sketch, 'Update cancelled.');
	    }

		// User has selected at least one layer, but none are symbols
		// TODO: Catch for when we have at least one symbol, but all are 'ignored'
		} else {
		
		  showMessage(sketch, MSG_SELECT_SYMBOL);
		}

	// User hasn't selected anything
  } else {
	  
	  showMessage(sketch, MSG_SELECT_SYMBOL);
  }
}
