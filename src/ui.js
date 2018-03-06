/*

UI-RELATED RESOURCES ONLY


TO DO

*** - REWRITE EVERYTHING AFFECTD BY v49 RELEASE
*** - Load settings from config file and use them globally
*** - Get more of these to not depend on 'sketch' object as a param
*** - Determine if sketch api actions are helpful
- Replace existing confirmation dlog with a full sync examination window
- Allow selection of files in folder lookup dialog
- Add in localisable string management, likely with key-based lookup
- Determine how to detect locale/user language settings, if possible
- Collect desired name from user for dumpToOutputFile
- Add in file overwrite confirmation for dumpToOutputFile
- Make content generation logic a bit more DRY in getConfirmationContent
- Find better way of handling these UI strings
- Determine which functions need to be exported, and which can stay private
- Check for shortcut conflicts with other plugins
- Add ability to change shortcuts for menu commands via dialog

*/


import { 
	formatFilePath, writeDataToFile
} from './file.js';

// UI strings and values
const uiStrings = {
	CONSOLE_ERR_PRFX : '[CODEX](ERR) ',
	ERR_CONFDLOG_NULL : 'Sketch API and/or symbol set not provided',
	ERR_CONFMSG_NULL : 'Symbols to sync and/or to ignore not provided',
	ERR_DATAWRITE_NULL : 'Sketch API and/or JSON data not provided',
	ERR_FILEPATH_NULL : 'No path provided',
	ERR_JSONSTR_NULL : 'JSON string not provided',
	ERR_LOADFORM_NULL : 'No form data provided',
	ERR_LAYER_NULL : 'No layer provided',
	LBL_CANCEL : 'Cancel',
	LBL_CHOOSE : 'Choose',
	LBL_CONTINUE : 'Continue',
	LBL_EXPORT : 'Export data',
	LBL_TITLE_CONFIRM_UPDATE : 'Confirm style guide update',
	MSG_CONFIRM_UPDATE : 'The style guide will be updated with the following symbols:',
	MSG_CONFIRM_IGNORE : "The following symbols will be 'ignored', and only partially synced with the style guide (no presentation changes will be made):", 
	MSG_SELECT_SYMBOL : 'Please select at least one symbol.',
	LBL_ABOUT_WIN : 'About Codex', 
	LBL_PREFS_WIN : 'Preferences',
	LBL_LINEITEM : ' · '
};

// Other constants
const ICON_FILE = 'icon_128x128.png';

// Make certain consts available elsewhere
export {
	uiStrings
};


/* ---- */
  

/** Show basic message to user in Sketch window
	  [!] Performs basic variable checks, but does not validate
    @param {string} message - Text to show user
*/
export function message( message ) {

	if (message !== undefined) {
	
	  //sketch.message(message);
	  context.document.showMessage(message);
	}
}


/* ---- */
  

/** Generate content for confirmation dialog
	  [!] Performs basic variable checks, but does not validate
    @param {object} syncItems - Collection of symbols to sync with server
    @param {object} ignoreItems - Collection of symbols to ignore
*/
export function getConfirmationContent( syncItems, ignoreItems ) {

	if ((syncItems !== undefined) && (ignoreItems !== undefined)) {

		let numSyncItems = syncItems.length;
		let numIgnoreItems = ignoreItems.length;
		let message = '';
		let i = numSyncItems;
		
		// Declare symbols to be synced
		if (numSyncItems >  0) {
			
			message = uiStrings.MSG_CONFIRM_UPDATE + '\n\n';
			i = numSyncItems;
			
		  while (i > 0) {
			  
			  i--;
			  message += syncItems[i];
			  message += (i > 0) ? uiStrings.LBL_LINEITEM : '';
		  }
		}
	  
	  if ((numSyncItems >  0) && (numIgnoreItems > 0)) {
		  
		  message += '\n\n';
	  }
	  
	  // Additional 'ignored' symbols need to be declared
	  if (numIgnoreItems > 0) {
		  
		  message += uiStrings.MSG_CONFIRM_IGNORE + '\n\n';
		  i = numIgnoreItems;
		  
		  while (i > 0) {
	
			  i--;
			  message += ignoreItems[i];
			  message += (i > 0) ? uiStrings.LBL_LINEITEM : '';
		  }
	  }
	  
	  return message + '\n';
	
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_CONFMSG_NULL);
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
			alert.addButtonWithTitle(uiStrings.LBL_CONTINUE);
			alert.addButtonWithTitle(uiStrings.LBL_CANCEL);
			alert.setMessageText(uiStrings.LBL_TITLE_CONFIRM_UPDATE);
		  alert.setInformativeText(getConfirmationContent(syncItems, ignoreItems));
		  
		  // Load confirmation dialog, returning click event
		  let clickEvent = alert.runModal();
		  return (clickEvent == NSAlertFirstButtonReturn);

		} catch(error) {

			console.log(uiStrings.CONSOLE_ERR_PRFX + error);
			return false;
		}
  
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_CONFDLOG_NULL);
		return false;
	}
}
