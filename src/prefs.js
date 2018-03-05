/*

FRAME LOAD DELEGATION

More info: https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc


UI DELEGATION

More info: https://developer.apple.com/reference/webkit/webuidelegate?language=objc


TO DO

*** - Find a way to make webview windows behave in a modal fashion; currently, 
	if focus isn't placed on a form field, typing on the keyboard can trigger 
	commands in the main app menus; also, it is possible to launch other actions 
	while one is already in progress
*** - Handle situations where user isn't authenticated, and thus cannot sync to 
	db
- sketch-module-web-view doesn't currently support click-and-drag support for 
  the window when the title bar is hidden; this needs to be accounted for when 
  this functionality is eventually available
- Consider whether it's worthwhile supporting storage of preferences in Sketch 
  app user preferences (using NSUserDefaults.standardUserDefaults -> saved to 
  Sketch plist file)
- Determine whether webview dialogs should be further abstracted and moved to 
  ui.js
- Handle instances where user quits before closing dialog, as it fails to save
- Determine which functions need to be exported, and which can stay private
- Determine if/how it'd be possible to store an encrypted auth key locally in 
  Sketch user prefs
- Build in disabling/enabling for parent-dependent subfields
- Build in handling for catastrophic error-handling when parsing config; if file 
	contents somehow get munged, revert to defaults and tell user

NSNonactivatingPanelMask

*/


import WebUI from 'sketch-module-web-view';

import { 
	uiStrings, message
} from './ui.js';

import { 
	writeDataToFile, readDataFromFile, getPluginsDir
} from './file.js';

// Default configuration, in case it isn't found where expected
const DEFAULT_USER_CONFIG = {
	ignoreFlag : '#', 
	useIgnoreFlag : true, 
	useDebugging : true
};

// Config file and path info
const CONFIG_FILENAME = 'codex_config.json';
const pluginsDir = getPluginsDir(context);

// Other constants
const PREFS_WIN_WIDTH = 640;
const PREFS_WIN_HEIGHT = 800;

// Container for user preferences; empty until we load from file
let userConfig = {};


/* ---- */


/** Primary prefs handling function
*/
export default function(context) {
	
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
        handleClose(webUI, true);
      }
      
    }
  })
}


/* ---- */


/** Get user preferences
	  [!] Performs basic variable checks, but does not validate
	  [!] Will return default settings if no saved settings are found!
    @return {object} — User preferences
*/
export function getPrefs() {
	
  // If preferences haven't been loaded yet...
  if (objEmpty(userConfig)) {
		
		// Load configuration file
		let prefsData = readDataFromFile(pluginsDir + CONFIG_FILENAME);
		prefsData = JSON.parse(prefsData);
		
		// If we got a null result from the file load attempt, 
		// populate with default settings and save in new config file 
		if (prefsData === null) {
			
			userConfig = DEFAULT_USER_CONFIG;
			writeDataToFile(userConfig, pluginsDir, CONFIG_FILENAME);
		
		// Otherwise, populate using data from file
		} else {
			
			userConfig = prefsData;
		}
  }
  
  return userConfig;
}


/* ---- */


/** Local utility function: handle prefs dialog closure
    Pull values from form in dialog, then write them to the config file
*/
function handleClose( webUI, closeWindow ) {

	try {
	
		// Pull form values from dialog
		let data = webUI.eval('getFormValues()');
		
		// Write form values to config file
		writeDataToFile(data, pluginsDir, CONFIG_FILENAME);
		
		// Close dialog window, as needed
		if (closeWindow) {
		
			webUI.panel.close();
		}
	
	} catch(error) {
		
		console.log('ERROR:', error);
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
