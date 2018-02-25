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
	dumpToOutputFile, getConfirmation, getLayerJSON, 
	MSG_SELECT_SYMBOL
} from './common.js';


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

	// Main sketch objects and other resources
	const sketch = context.api();
  const selectedLayers = sketch.selectedDocument.selectedPage.selectedLayers;	
  const foundSymbols = [];	// Container to hold selected symbols
  
  /* ---- */

	// If this layer is a symbol master, recurse through it and grab any other
	// children that are dependent symbols
	// If this layer is a symbol instance, grab its master and use that for 
	// recursive examination
	// TODO: How do we deal with local overrides?
  function processLayer( layer ) {
		    
    let layerName = layer.sketchObject.className();
    
    // If this is a symbol...
    // TODO: handle diffs between instances and masters
    // TODO: Recurse this!
    if ((layerName == LAYER_TYPE_SYMBOL_INSTANCE) || 
    	  (layerName == LAYER_TYPE_SYMBOL_MASTER)) {

			// Get JSON for selected symbol
			// TODO: Non-JSON formatting of symbols collection info can lead to parse errors
			let jsonString = getLayerJSON(layer);
			foundSymbols.push(jsonString);
    }
  }

  /* ---- */
  
  // If user has selected at least one item...
  if (selectedLayers.length > 0) {

		// Traverse selected layer(s) to gather symbol information
		selectedLayers.iterate((layer) => { processLayer(layer); });
		
		// If we have symbols to sync, proceed; 
		// if not, we risk errors when syncing/dumping the data
		let numSymbols = foundSymbols.length;
		if (numSymbols > 0) {

			// Load confirmation dialog, capturing click event
			let clickEvent = getConfirmation(sketch, foundSymbols);
	    
	    // If user has opted to continue...
	    if (clickEvent == NSAlertFirstButtonReturn) {
		  
				// Debug: dump JSON to file, instead of pushing to server
				if (DEBUG) {
		
					dumpToOutputFile(JSON.stringify(foundSymbols, null, "\t"));
				
				} else {
					
					// Push it to server
				}

	    }

		// User has selected at least one layer, but none are symbols
		// TODO: Catch for when we have at least one symbol, but all are 'ignored'
		} else {
		
		  sketch.message(MSG_SELECT_SYMBOL);
		}

	// User hasn't selected anything
  } else {
	  
	  sketch.message(MSG_SELECT_SYMBOL);
  }
}
