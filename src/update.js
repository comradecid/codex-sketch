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
*** - Examine v49 API changes and make revisions to code accordingly
- Remove double-write to syncSymbols, ignoreSymbolNames?
- How do we deal with local overrides?
- Handle diffs between instances and masters
- Recurse symbol processing
- Consider the use of actions for certain handling; for example:

    {
      "script": "script.js",
      "handlers": {
        "actions": {
          "Startup" : "onStart"
        }
      }
    },
    {
      "script": "script.js",
      "handlers": {
        "actions": {
          "OpenDocument" : "onDocOpen"
        }
      }
    }
    
- Examine where action-driven scripts could make certain intelligibility and 
  maintencance of the the code easier (ex: startup -> declare global resources, 
  check authentication, preload prefs, etc.)

*/


import { 
	uiStrings, getConfirmation, message
} from './ui.js';

import {
	dumpToOutputFile
} from './file.js';

import { 
	getLayerJSON, processLayer
} from './data.js';

import { 
	getPrefs
} from './prefs.js';

// Main sketch objects and other resources
const sketch = context.api();

// Containers to hold selected symbols
let syncSymbols = [];
let ignoreSymbolNames = [];
let useSymbolNames = [];

// Get user preferences for key behaviour; store as variables to avoid repeated 
/// lookups
let prefs = getPrefs();
let useIgnoreFlag = prefs.useIgnoreFlag;
let ignoreFlag = prefs.ignoreFlag;
let useDebugging = prefs.useDebugging;

// Make certain consts available elsewhere
export {
	syncSymbols, ignoreSymbolNames, useSymbolNames, 
  useIgnoreFlag, ignoreFlag, useDebugging
};


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
			let confirmed = getConfirmation(sketch, useSymbolNames, ignoreSymbolNames);
	    
	    // If user has opted to continue...
	    if (confirmed) {
		  
		  	// TMP
		  	let dataString = JSON.stringify(syncSymbols, null, "\t");

				// Debug: dump JSON to file, instead of pushing to server
				if (useDebugging) {

					dumpToOutputFile(dataString);
				
				} else {
					
					// Push it to server
					message('(do stuff)');
				}

			// User cancelled sync
	    } else {
		  
		  	// TMP
		    message('Update cancelled.');
		    
		    // Clear symbol collections
				syncSymbols = [];
				ignoreSymbolNames = [];
				useSymbolNames = [];
	    }

		// User has selected at least one layer, but none are symbols
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
