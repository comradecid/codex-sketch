// UI strings and values
const CONSOLE_ERR_PRFX = '[HYDRA](ERR) ';
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
const ICON_FILE = 'icon.png';
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


/* ---- */
  

/** Strip file prefix from path string
    @param {string} path - Path to clean up
    @return {string} Cleaned-up path
*/
export function formatFilePath( path ) {

	if (path !== undefined) {
	
	  path = path.toString();
		return (0 === path.indexOf("file://")) ? 
			path.substring(7) : path;
	
	} else {
		
		console.log(CONSOLE_ERR_PRFX + ERR_FILEPATH_NULL);
	}
}


/* ---- */
  

/** Pre-process symbols and get confirmation of sync
    @param {string} sketch - Sketch API from context
    @param {string} symbols - Changes that will be synced
    @return {object} Click event for dialog	
*/
export function getConfirmation( sketch, symbols ) {

	if ((sketch !== undefined) && (symbols !== undefined)) {

		try {
			
			const iconPath = formatFilePath(sketch.resourceNamed(ICON_FILE));
			const iconImage = NSImage.alloc().initWithContentsOfFile(iconPath);
		
			// Set up confirmation dialog
			let alert = NSAlert.alloc().init();
			alert.setIcon(iconImage);
			alert.addButtonWithTitle(LBL_CONTINUE);
			alert.addButtonWithTitle(LBL_CANCEL);
			alert.setMessageText(LBL_TITLE_CONFIRM_UPDATE);
			
			
			// TODO: move this into main.js as part of processLayer!
			//((0 === layerName.indexOf(SYMBOL_IGNORE_FLAG)) ? { 'ignore' : true } : null)
			// Assemble list of changes to be synced, for messaging to user
		  // TODO: Spit out names in reverse order, replace for/in loop
		  // TODO: Cut off if over a certain number?
		  // TODO: List ignored in similar, separate list
			let message = MSG_CONFIRM_UPDATE + '\n\n';
			let name = '';
			let numSymbols = symbols.length;
			let ignoreList = [];
			let numIgnores;
			
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
		  
		  message += '\n';
		  alert.setInformativeText(message);
		  
		  return alert.runModal();

		} catch(error) {

			console.log(CONSOLE_ERR_PRFX + error);
		}
  
	} else {
		
		console.log(CONSOLE_ERR_PRFX + ERR_CONFDLOG_NULL);
	}
}


/* ---- */
  

/** Display save file dialog to capture output
    @param {string} jsonString — Content to save as JSON	
*/
export function dumpToOutputFile( jsonString ) {

	if (jsonString !== undefined) {

		try {
			
		  // NOTE: Currently, this will automatically overwrite any 
		  // existing dumpfiles, and does not accept name changes
		  // Always uses same filename, as set by global var
		  // TODO: Add in overwrite confirmation?
		  
		  // Set up 'select folder' dialog options, as Sketch API does not 
		  // currently support file dialogs
			let panel = NSOpenPanel.openPanel();
			panel.setCanChooseDirectories(true);
			panel.setCanCreateDirectories(true);
			panel.setCanChooseFiles(false);
			panel.setPrompt(LBL_CHOOSE);
			
			// Load file save dialog, capturing click event
			let clickEvent = panel.runModal();
			
			// If user has opted to continue...
			if (clickEvent == NSFileHandlingPanelOKButton) {
				
				// Get target directory path
				let dirURL = panel.URL();
				dirURL = formatFilePath(dirURL);
		
				// TODO: Figure out why this is randomly so slow
				// TODO: Figure out why stringify is failing on foundSymbols
				let content = 
					NSString.stringWithString(jsonString);
				let t = 
					NSString.stringWithFormat("%@", content);
				let f = 
					NSString.stringWithFormat("%@", dirURL + OUTPUT_FILENAME);
				t.writeToFile_atomically_encoding_error(f, true, NSUTF8StringEncoding, null);
			}

		} catch(error) {

			console.log(CONSOLE_ERR_PRFX + error);
		}
		
	} else {
		
		console.log(CONSOLE_ERR_PRFX + ERR_JSONSTR_NULL);
	}
}
