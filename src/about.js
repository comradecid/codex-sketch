/*

FRAME LOAD DELEGATION

More info: https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc


UI DELEGATION

More info: https://developer.apple.com/reference/webkit/webuidelegate?language=objc


WARNINGS

The webUI.eval() function can really screw up values being passed along to other 
areas; be aware that results may not match expectations! 


TO DO

*** - Find a way to make webview windows behave in a modal fashion
- sketch-module-web-view doesn't currently support click-and-drag support for 
  the window when the title bar is hidden; this needs to be accounted for when 
  this functionality is eventually available
- Determine whether webview dialogs should be further abstracted and moved to 
  ui.js
- Determine which functions need to be exported, and which can stay private

NSNonactivatingPanelMask

*/


import WebUI from 'sketch-module-web-view';

import { 
	uiStrings, message
} from './ui.js';

// Other constants
const ABOUT_WIN_WIDTH = 640;
const ABOUT_WIN_HEIGHT = 480;


/* ---- */


/** Primary about handling function
*/
/** Primary prefs handling function
*/
export default function(context) {
	
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
	    
	    // Serves as an 'onload' handler for page in webview
      'webView:didFinishLoadForFrame:'(webView, webFrame) {
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

		// Close dialog window, as needed
		if (closeWindow) {
		
			webUI.panel.close();
		}
	
	} catch(error) {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + error);
	}
}


