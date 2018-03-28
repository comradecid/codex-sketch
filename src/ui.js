/*

UI RESOURCES


TO DO

*** - REWRITE EVERYTHING AFFECTD BY v49 RELEASE
*** - Load settings from config file and use them globally
*** - Get more of these to not depend on 'sketch' object as a param
*** - Determine if sketch api actions are helpful
*** - Genericise WebView window calls
- Replace existing confirmation dlog with a full sync examination window
- Allow selection of files in folder lookup dialog
- Add in localisable string management, likely with key-based lookup
- Determine how to detect locale/user language settings, if possible
- Collect desired name from user for dumpToOutputFile
- Add in file overwrite confirmation for dumpToOutputFile
- Make content generation logic a bit more DRY in getConfirmationContent
- Determine which functions need to be exported, and which can stay private
- Check for shortcut conflicts with other plugins
- Add ability to change shortcuts for menu commands via dialog

*/

// TMP: Sketch settings API subset
import * as Settings from 'sketch/settings';

// WebView window resources
import WebUI from 'sketch-module-web-view';

// File-handling resources
import {
  formatFilePath
} from './data.js';

// UI strings and values
global.uiStrings = {
	CONSOLE_ERR_PRFX : '[CODEX](ERR) ',
	ERR_CONFDLOG_NULL : 'Sketch API and/or symbol set not provided',
	ERR_CONFMSG_NULL : 'Symbols to sync and/or to ignore not provided',
	ERR_DATAWRITE_NULL : 'Sketch API and/or JSON data not provided',
	ERR_FILEPATH_NULL : 'No path provided',
	ERR_JSONSTR_NULL : 'JSON string not provided',
	ERR_LOADFORM_NULL : 'No form data provided',
	ERR_LAYER_NULL : 'No layer provided',
	ERR_APPPREF_NULL : 'No value found for key',
	ERR_GET_APPPREF_NULL : 'No pref key provided',
	ERR_SET_APPPREF_NULL : 'No pref key and/or value provided',
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
const ABOUT_WIN_WIDTH = 640;
const ABOUT_WIN_HEIGHT = 800;
const PREFS_WIN_WIDTH = 640;
const PREFS_WIN_HEIGHT = 800;


/* ---- */
  

/** Show basic inline message to user in Sketch window
	  [!] Performs basic variable checks, but does not validate
    @param {string} message - Text to show user
*/
export function message( message ) {

	if (message !== undefined) {
	
    context.document.showMessage(message);
	}
}


/* ---- */
  

/** Pre-process symbols and get confirmation of sync
	  [!] Performs basic variable checks, but does not validate
    @param {string} sketch - Sketch API from context
    @param {string} symbols - Changes that will be synced
    @return {object} — Click event for dialog	
*/
export function getConfirmation( content ) {

	if (content !== undefined) {

		try {

			// Set up confirmation dialog
			let alert = NSAlert.alloc().init();
			alert.setIcon(getDlogIcon());
			alert.addButtonWithTitle(uiStrings.LBL_CONTINUE);
			alert.addButtonWithTitle(uiStrings.LBL_CANCEL);
			alert.setMessageText(uiStrings.LBL_TITLE_CONFIRM_UPDATE);
		  alert.setInformativeText(content);
		  
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


/* ---- */


/** Display save file dialog to capture output data dump
	  [!] Performs basic variable checks, but does not validate
    @param {string} jsonString — Content to save as JSON	
*/
export function getOutputFolder( data ) {

	if (data !== undefined) {

		try {
			
		  // NOTE: Currently, this will automatically overwrite any 
		  // existing dumpfiles, and does not accept name changes
		  // Always uses same filename, as set by global var
		  
		  // Set up 'select folder' dialog
			let panel = NSOpenPanel.openPanel();
			panel.setCanChooseDirectories(true);
			panel.setCanCreateDirectories(true);
			panel.setCanChooseFiles(false);
			panel.setPrompt(uiStrings.LBL_EXPORT);

			// Load file save dialog, capturing click event
			let clickEvent = panel.runModal();
			if (clickEvent == NSFileHandlingPanelOKButton) {
		
				// Dump data to new file at target directory path
				writeDataToFile(data, formatFilePath(panel.URL()), OUTPUT_FILENAME);
			}

		} catch(error) {

			console.log(uiStrings.CONSOLE_ERR_PRFX + error);
		}
		
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_JSONSTR_NULL);
	}
}


/* ---- */


/** Show 'Preferences' dialog containing plugin user settings
*/
export function showPreferencesDlog( context ) {
	
	// Create webview dialog
  const webUI = new WebUI(context, require('../resources/dlog_prefs.html'), {
    identifier: 'codex.prefs', // Unique ID for referring to this dialog
    x: 0,
    y: 0,
	  width: PREFS_WIN_WIDTH,
	  height: PREFS_WIN_HEIGHT,
    blurredBackground: true,
    onlyShowCloseButton: true,
		title: uiStrings.LBL_PREFS_WIN,
    hideTitleBar: false,
    shouldKeepAround: true,
		resizable: false, 
    frameLoadDelegate: {
	    
	    // Serves as an 'onload' handler for page in webview
      'webView:didFinishLoadForFrame:'(webView, webFrame) {
        
				// TODO: dataString is still getting interpreted as an object;
				//       find another way of handling this?
				let dataString = JSON.stringify(getPrefs());
        // Populate webview form with values
        webUI.eval(`loadFormValues(${dataString})`);
      }
    
    },
  	uiDelegate: {}, 
	  onPanelClose: function () {  // Return `false` to prevent closing the panel
	  
	    handleClose(webUI);
	  }, 
    handlers: {
	
      // Close window
      dismiss() {
        
        // Calling a direct close on the panel doesn't fire the onPanelClose 
        // event; as such, we need to call it manually
        handlePanelClose(webUI, true);
      }
      
    }
  });
}


/* ---- */


/** Show 'About' dialog containing plugin info and help documentation
*/
export function showAboutDlog( context ) {
	
	// Create webview dialog
  const webUI = new WebUI(context, require('../resources/dlog_about.html'), {
    identifier: 'codex.about', // Unique ID for referring to this dialog
    x: 0,
    y: 0,
	  width: ABOUT_WIN_WIDTH,
	  height: ABOUT_WIN_HEIGHT,
    blurredBackground: true,
    onlyShowCloseButton: true,
		title: uiStrings.LBL_ABOUT_WIN,
    hideTitleBar: false,
    shouldKeepAround: true,
		resizable: false, 
    frameLoadDelegate: {
	    
      // Serves as an 'onload' handler for page in webview; 
      // doesn't always work as expected
      'webView:didFinishLoadForFrame:'(webView, webFrame) {
      }
    
    },
  	uiDelegate: {}, 
	  onPanelClose: function () {  // Return `false` to prevent closing the panel
	  
	    handlePanelClose(webUI);
	  }, 
    handlers: {

      // Get custom token for user
      checkToken() {

        // Attempt to pull token from user app settings
        let token = Settings.settingForKey('token');

        // Call appropriate handler in userauth_for_dlogs.js
        webUI.eval(`handleTokenCheck('${token}')`);
      },

      // Store custom token for user
      storeToken( token ) {

        //console.log('storing token:', token);
        Settings.setSettingForKey('token', token);
      },

      // Wipe custom token for user
      wipeToken() {

        //console.log('storing token:', token);
        Settings.setSettingForKey('token', null);
      },

      // Close window
      dismiss() {
        
        // Calling a direct close on the panel doesn't fire the onPanelClose 
        // event; as such, we need to call it manually
        handlePanelClose(webUI, true);
      }
      
    }
  });
}


/* ---- */


/** Local utility function: Handle prefs dialog closure
    Pull values from form in dialog, then write them to the config file
*/
function handlePanelClose( webUI, closeWindow ) {

	try {

		// Close dialog window, as needed
		if (closeWindow) {
		
			webUI.panel.close();
		}
	
	} catch(error) {
		
		//console.log(uiStrings.CONSOLE_ERR_PRFX + error);
	}
}


/* ---- */


/** Local utility function: Get standard dialog icon
    @return {object} — Image object for icon
*/
function getDlogIcon() {

  let api = context.api();
  let iconPath = formatFilePath(api.resourceNamed(ICON_FILE));
  let iconImage = NSImage.alloc().initWithContentsOfFile(iconPath);

  return iconImage;
}


/* ---- */
  

/** Generate content for update confirmation dialog
	  [!] Performs basic variable checks, but does not validate
    @param {object} syncItems - Collection of symbols to sync with server
    @param {object} ignoreItems - Collection of symbols to ignore
*/
export function getUpdateConfirmationContent( syncItems, ignoreItems ) {

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


/** Local utility: check if prefs object is empty
*/
function objEmpty( obj ) {
	
	if (obj !== undefined) {

		return ((Object.keys(obj).length === 0) && 
			(obj.constructor === Object));
	}
}
