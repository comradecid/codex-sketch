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


DEPENDENCIES

Requires the use of:

- skpm/sketch-module-web-view for generating webview-based windows for interacting with the user
  More info: https://github.com/skpm/sketch-module-web-view


TO DO

*** - Webview windows can't currently behave modally; prevent this script from 
  breaking if user has accidentally dismissed document window but not update 
  dlog
*** - Fix data format dump to file
- Remove double-write to syncSymbols, ignoreSymbolNames
- How do we deal with local overrides?
- Handle diffs between instances and masters
- Recurse symbol processing

*/


import { 
	uiStrings, dumpToOutputFile, getConfirmation, message
} from './ui.js';

import { 
	getLayerJSON
} from './data.js';

import { 
	getPrefs
} from './prefs.js';

// Identifiers
const LAYER_TYPE_SYMBOL_INSTANCE = 'MSSymbolInstance';
const LAYER_TYPE_SYMBOL_MASTER = 'MSSymbolMaster';
const SYMBOL_IGNORE_FLAG = '#';  // TODO: Get rid of this

// Main sketch objects and other resources
const sketch = context.api();

// Containers to hold selected symbols
const syncSymbols = [];
const ignoreSymbolNames = [];


/* ---- */


/**
 *  Primary parsing + syncing function
 *  - Checks for selected symbols
 *  - Traverses selected symbols contents recursively for sub-symbols
 *  - Assembles syncable information into JSON set
 *  - Delivers JSON to server for further processing
 */
export default function (context) {

	// Get user-selected symbols
  const selectedLayers = sketch.selectedDocument.selectedPage.selectedLayers;
 
  /* ---- */

try {

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
		  
		  	// TMP
		  	let dataString = JSON.stringify(syncSymbols, null, "\t");
		  	let prefs = getPrefs();

				// Debug: dump JSON to file, instead of pushing to server
				if (prefs.useDebugging) {

					dumpToOutputFile(dataString);
				
				} else {
					
					// Push it to server
					message('(do stuff)');
				}

			// User cancelled sync
	    } else {
		  
		  	// TMP
		    message('Update cancelled.');
	    }

		// User has selected at least one layer, but none are symbols
		// TODO: Catch for when we have at least one symbol, but all are 'ignored'
		} else {
		
		  message(uiStrings.MSG_SELECT_SYMBOL);
		}

	// User hasn't selected anything
  } else {
	  
	  message(uiStrings.MSG_SELECT_SYMBOL);
  }

} catch(error) {
  console.log(error);	
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

				message += (i > 0) ? uiStrings.LBL_LINEITEM : '';
				message += symbols[i].name;
			}
	  }
	  
	  numIgnores = ignoreList.length;
	  if (numIgnores > 0) {
		  
		  message += '\n\n' + uiStrings.MSG_CONFIRM_IGNORE + '\n\n';
		  
		  for (let i in ignoreList) {
			  
			  message += (i > 0) ? uiStrings.LBL_LINEITEM : '';
				message += ignoreList[i];
		  }
	  }
*/

		// TODO: Re-account for ignored items
		syncSymbols.push(jsonString);
		ignoreSymbolNames.push(layerName);
  }
}
 