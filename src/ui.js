/*

UI-RELATED RESOURCES ONLY

*/


// UI strings and values
const CONSOLE_ERR_PRFX = '[CODEX](ERR) ';
const ERR_CONFDLOG_NULL = 'Sketch API and/or symbol set not provided';
const ERR_CONFMSG_NULL = 'Symbols to sync and/or to ignore not provided';
const ERR_DATAWRITE_NULL = 'Sketch API and/or JSON data not provided';
const ERR_FILEPATH_NULL = 'No path provided';
const ERR_JSONSTR_NULL = 'JSON string not provided';
const ERR_LAYER_NULL = 'No layer provided';
const ERR_MESSAGE_NULL = 'Sketch API and/or message not provided';
const LBL_CANCEL = 'Cancel';
const LBL_CHOOSE = 'Choose';
const LBL_CONTINUE = 'Continue';
const LBL_TITLE_CONFIRM_UPDATE = 'Confirm style guide update';
const MSG_CONFIRM_UPDATE = 'Would you like to update the style guide with the following symbols?';
const MSG_CONFIRM_IGNORE = 'The following symbols will be ignored, and not synced with the style guide:';
const MSG_SELECT_SYMBOL = 'Please select at least one symbol.';
const ICON_FILE = 'icon_128x128.png';
const OUTPUT_FILENAME = 'codex_output.json';
const LBL_LINEITEM = ' · ';
const SYMBOL_IGNORE_FLAG = '#';

// Make certain consts available elsewhere
export {
	MSG_SELECT_SYMBOL, CONSOLE_ERR_PRFX, ERR_LAYER_NULL
};


/* ---- */
  

/** Generate content for confirmation dialog
	  [!] Performs basic variable checks, but does not validate
    @param {object} syncItems - Collection of symbols to sync with server
    @param {object} ignoreItems - Collection of symbols to ignore
*/
export function getConfirmationContent( syncItems, ignoreItems ) {

	if ((syncItems !== undefined) && (ignoreItems !== undefined)) {

		// TODO: Make this more DRY

		let message = MSG_CONFIRM_UPDATE + '\n\n';
	  let numItems = syncItems.length;
		let i = numItems;
	  while (i > 0) {
		  
		  i--;
		  message += syncItems[i].name;
		  message += (i > 0) ? LBL_LINEITEM : '';
	  }
	  
		message += '\n\n' + MSG_CONFIRM_IGNORE + '\n\n';
		numItems = ignoreItems.length;
	  i = numItems;
	  while (i > 0) {

		  i--;
		  message += ignoreItems[i];
		  message += (i > 0) ? LBL_LINEITEM : '';
	  }
	  
	  return message + '\n';
	
	} else {
		
		console.log(CONSOLE_ERR_PRFX + ERR_CONFMSG_NULL);
	}
}


/* ---- */
  

/** Strip file prefix from path string
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
		
		console.log(CONSOLE_ERR_PRFX + ERR_FILEPATH_NULL);
	}
}


/* ---- */
  

/** Write JSON data to target file
	  [!] Performs basic variable checks, but does not validate
    @param {string} data - JSON data to write
     @param {string} path - Filepath to write to
*/
export function writeDataToFile( data, path ) {

	if ((path !== undefined) && (data !== undefined)) {
	
		let jsonString = JSON.stringify(data, null, "\t");
		let content = 
			NSString.stringWithString(jsonString);
		let formattedContent = 
			NSString.stringWithFormat("%@", content);
		let formattedPath = 
			NSString.stringWithFormat("%@", path + OUTPUT_FILENAME);
		
		formattedContent.writeToFile_atomically_encoding_error(
			formattedPath, true, NSUTF8StringEncoding, null);
	
	} else {
		
		console.log(CONSOLE_ERR_PRFX + ERR_DATAWRITE_NULL);
	}
}

/*
function readFile(path) {
    return NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, null);
}

function writeFile(path, content) {
    const string = NSString.stringWithFormat("%@", content);
    return string.writeToFile_atomically(path, true);
}
*/

/* ---- */
  

/** Show message to user in Sketch window
	  [!] Performs basic variable checks, but does not validate
    @param {string} sketch - Sketch API from context
    @param {string} message - Text to show user
*/
export function showMessage( sketch, message ) {

	if ((sketch !== undefined) && (message !== undefined)) {
	
	  sketch.message(message);
	
	} else {
		
		console.log(CONSOLE_ERR_PRFX + ERR_MESSAGE_NULL);
	}
}


/* ---- */
  

/** Pre-process symbols and get confirmation of sync
	  [!] Performs basic variable checks, but does not validate
    @param {string} sketch - Sketch API from context
    @param {string} symbols - Changes that will be synced
    @return {object} Click event for dialog	
*/
export function getConfirmation( sketch, syncItems, ignoreItems ) {

	if ((sketch !== undefined) && 
			(syncItems !== undefined) && (ignoreItems !== undefined)) {

		try {
			
			const iconPath = formatFilePath(sketch.resourceNamed(ICON_FILE));
			const iconImage = NSImage.alloc().initWithContentsOfFile(iconPath);
		
			// Set up confirmation dialog
			let alert = NSAlert.alloc().init();
			alert.setIcon(iconImage);
			alert.addButtonWithTitle(LBL_CONTINUE);
			alert.addButtonWithTitle(LBL_CANCEL);
			alert.setMessageText(LBL_TITLE_CONFIRM_UPDATE);
		  alert.setInformativeText(getConfirmationContent(syncItems, ignoreItems));
		  
		  // Load confirmation dialog, returning click event
		  let clickEvent = alert.runModal();
		  return (clickEvent == NSAlertFirstButtonReturn);

		} catch(error) {

			console.log(CONSOLE_ERR_PRFX + error);
			return false;
		}
  
	} else {
		
		console.log(CONSOLE_ERR_PRFX + ERR_CONFDLOG_NULL);
		return false;
	}
}


/* ---- */
  

/** Display save file dialog to capture output
	  [!] Performs basic variable checks, but does not validate
    @param {string} jsonString — Content to save as JSON	
*/
export function dumpToOutputFile( data ) {

	if (data !== undefined) {

		try {
			
		  // NOTE: Currently, this will automatically overwrite any 
		  // existing dumpfiles, and does not accept name changes
		  // Always uses same filename, as set by global var
		  // TODO: Add in overwrite confirmation?
		  
		  // Set up 'select folder' dialog
			let panel = NSOpenPanel.openPanel();
			panel.setCanChooseDirectories(true);
			panel.setCanCreateDirectories(true);
			panel.setCanChooseFiles(false);
			panel.setPrompt(LBL_CHOOSE);

//open.setTitle("Import a Color Palette");
//open.setPrompt("Import Palette");

			// Load file save dialog, capturing click event
			let clickEvent = panel.runModal();
			if (clickEvent == NSFileHandlingPanelOKButton) {
		
				// Dump data to new file at target directory path
				writeDataToFile(data, formatFilePath(panel.URL()));
			}

		} catch(error) {

			console.log(CONSOLE_ERR_PRFX + error);
		}
		
	} else {
		
		console.log(CONSOLE_ERR_PRFX + ERR_JSONSTR_NULL);
	}
}
