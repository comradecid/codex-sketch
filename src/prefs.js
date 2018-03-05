/*

FRAME LOAD DELEGATION

More info: https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc


UI DELEGATION

More info: https://developer.apple.com/reference/webkit/webuidelegate?language=objc


TO DO

*** - Find a way to make webview windows behave in a modal fashion
- As soon as dlog loads, get getPluginsDir, and store path somewhere for re-use
- sketch-module-web-view doesn't currently support click-and-drag support for 
  the window when the title bar is hidden; this needs to be accounted for when 
  this functionality is eventually available
- Consider whether it's worthwhile supporting storage of preferences in Sketch 
  app user preferences (using NSUserDefaults.standardUserDefaults -> saved to 
  Sketch plist file)
- Determine whether webview dialogs should be further abstracted and moved to 
  ui.js
- Lock UI when reading/writing config file?

*/


import WebUI from 'sketch-module-web-view';
import { isWebviewPresent, sendToWebview } from 'sketch-module-web-view/remote';

import { 
	uiStrings, message, 
	PREFS_WIN_WIDTH, PREFS_WIN_HEIGHT, CONFIG_FILENAME
} from './ui.js';

import { 
	writeDataToFile, getPluginsDir
} from './file.js';

// Default configuration, in case it isn't found where expected
const DEFAULT_CONFIG = {
	ignoreFlag : '#', 
	useIgnoreFlag : true, 
	useDebugging : true
};


const pluginsDir = getPluginsDir(context);


/* ---- */


/** Primary prefs handling function
*/
export default function(context) {
	
  const webUI = new WebUI(context, require('../resources/dlog_prefs.html'), {
    identifier: 'codex.prefs', // Unique ID for referring to this dialog
    x: 0,
    y: 0,
	  width: PREFS_WIN_WIDTH,
	  height: PREFS_WIN_HEIGHT,
    blurredBackground: true,
    onlyShowCloseButton: true,
		title: uiStrings.PREFS_WIN_TITLE,
    hideTitleBar: false,
    shouldKeepAround: true,
		resizable: false, 
    frameLoadDelegate: {
	    
	    // Serves as an 'onload' handler for page in webview
      'webView:didFinishLoadForFrame:'(webView, webFrame) {
	      
        // Load configuration file
        // TMP
				let data = {
				
					ignoreFlag : '#', 
					useIgnoreFlag : true, 
					useDebugging : true
				};
				let dataString = JSON.stringify(data);
// TODO: dataString is still getting interpreted as an object
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
