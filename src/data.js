// UI strings and values
const CONSOLE_ERR_PRFX = '[CODEX](ERR) ';
const ERR_CONFDLOG_NULL = 'Sketch API and/or symbol set not provided';
const ERR_FILEPATH_NULL = 'No path provided';
const ERR_JSONSTR_NULL = 'JSON string not provided';
const ERR_LAYER_NULL = 'No layer provided';
const LBL_CANCEL = 'Cancel';
const LBL_CHOOSE = 'Choose';
const LBL_CONTINUE = 'Continue';
const LBL_TITLE_CONFIRM_UPDATE = 'Confirm style guide update';
const MSG_CONFIRM_UPDATE = 'Would you like to update the style guide with the following symbols?';
const MSG_CONFIRM_IGNORE = 'The following symbols will be ignored, and not synced with the style guide:';
const MSG_SELECT_SYMBOL = 'Please select at least one symbol.';
const ICON_FILE = 'icon_128x128.png';
const OUTPUT_FILENAME = 'hydra_output.json';
const LBL_LINEITEM = ' · ';
const SYMBOL_IGNORE_FLAG = '#';

// TMP: Make certain consts available elsewhere
export {
	MSG_SELECT_SYMBOL
};


/* ---- */
  

/** Get corresponding JSON data for layer object
    @param {object} layer - Layer object to process
    @return {string} Stringified JSON
*/
export function getLayerJSON( layer ) {

	if (layer !== undefined) {
	
		try {
			
			let dict = layer.sketchObject.treeAsDictionary();
			let jsonData = NSJSONSerialization.dataWithJSONObject_options_error_(dict, 0, nil);
			let jsonString = NSString.alloc().initWithData_encoding_(jsonData, NSUTF8StringEncoding);

			return jsonString;
			
		} catch(error) {

			console.log(CONSOLE_ERR_PRFX + error);
		}

	} else {
		
		console.log(CONSOLE_ERR_PRFX + ERR_LAYER_NULL);
	}
}


