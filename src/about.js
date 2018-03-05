/*

FRAME LOAD DELEGATION

More info: https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc


UI DELEGATION

More info: https://developer.apple.com/reference/webkit/webuidelegate?language=objc


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
export default function(context) {
	}


/* ---- */


