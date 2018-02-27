/*

DATA-MANAGEMENT RESOURCES ONLY

*/


import { 
	CONSOLE_ERR_PRFX, ERR_LAYER_NULL
} from './ui.js';


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

			console.log(CONSOLE_ERR_PRFX + error);
		}

	} else {
		
		console.log(CONSOLE_ERR_PRFX + ERR_LAYER_NULL);
	}
}


