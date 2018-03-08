/*

DATA-PROCESSING RESOURCES ONLY


TO DO

- Determine which functions need to be exported, and which can stay private

*/


import { 
	uiStrings
} from './ui.js';

import { 
	syncSymbols, ignoreSymbolNames, useSymbolNames, 
  useIgnoreFlag, ignoreFlag, useDebugging
} from './update.js';

// Identifiers
const LAYER_TYPE_SYMBOL_INSTANCE = 'MSSymbolInstance';
const LAYER_TYPE_SYMBOL_MASTER = 'MSSymbolMaster';


/* ---- */
  

/** Get corresponding JSON data for layer object
	  [!] Performs basic variable checks, but does not validate
    @param {object} layer - Layer object to process
    @return {object} JSON object
*/
export function getLayerJSON( layer ) {

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


/** Local utility function: process symbol for possible sync with style guide
*/
// If this layer is a symbol master, recurse through it and grab any other
// children that are dependent symbols
// If this layer is a symbol instance, grab its master and use that for 
// recursive examination
export function processLayer( layer ) {
	    
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
 