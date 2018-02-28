/*

WORKING WITH THIS PLUGIN

Much of the underlying Sketch API is undocumented, only partially exposes 
underlying functionality, and/or is totally reliant on working with some form 
of cocoascript. As such, any modifications should be made cautiously, and with 
the understanding that any changes by the Sketch team between app versions may 
break this plugin code.

More info:
http://developer.sketchapp.com/examples/plugins/resources


AVOID COCOASCRIPT

If you need to insert cocoascript anywhere, refer to this document for instead 
converting it to JS: http://developer.sketchapp.com/guides/cocoascript

Doing so helps prevent build errors with the Sketch Plugin Manager 
(https://github.com/skpm) — at present, it can't compile cocoascript — and makes
this code more accessible to other contributors, whilst still allowing us to 
access important AppKit functionality.


DEBUGGING

This plugin includes very basic reporting to console in case of common errors, 
and also has a 'DEBUG' flag, which when set to true dumps the JSON output to a 
local file instead attempting to push it to the database.

Other common tools and techniques are available elsewhere. More info: 
http://developer.sketchapp.com/guides/debugging-plugins
https://medium.com/@bomberstudios/debugging-sketch-plugins-e134b14ee22
https://medium.com/@marianomike/the-beginners-guide-to-writing-sketch-plugins-part-1-28a5e3f01c68


DEPENDENCIES

Requires the use of:

- skpm/sketch-module-web-view for generating webview-based windows for interacting with the user
  More info: https://github.com/skpm/sketch-module-web-view

*/

import WebUI from 'sketch-module-web-view';

import { 
	dumpToOutputFile, getConfirmation, showMessage, 
	MSG_SELECT_SYMBOL
} from './ui.js';

import { 
	getLayerJSON
} from './data.js';


// Debugging
const DEBUG = true;


/* ---- */


/**
 *  Primary parsing + syncing function
 *  - Checks for selected symbols
 *  - Traverses selected symbols contents recursively for sub-symbols
 *  - Assembles syncable information into JSON set
 *  - Delivers JSON to server for further processing
 */
export default function (context) {

/* -- TMP -- */

	try {

const options = {
  identifier: 'fuck', // to reuse the UI
  x: 0,
  y: 0,
  width: 640,
  height: 480,
//  background: NSColor.whiteColor(),
	blurredBackground: true,
  onlyShowCloseButton: true,
 title: 'Confirm sync',
//  hideTitleBar: false,
//  shouldKeepAround: true,
  resizable: false
/*
  frameLoadDelegate: { // https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc
    'webView:didFinishLoadForFrame:': function (webView, webFrame) {
      context.document.showMessage('UI loaded!')
      WebUI.clean()
    }
  },
  uiDelegate: {}, // https://developer.apple.com/reference/webkit/webuidelegate?language=objc
  onPanelClose: function () {
    // Stuff
    // return `false` to prevent closing the panel
  }
*/
}

const webUI = new WebUI(context, require('../assets/content.html'), options);

/* -- /TMP -- */

		} catch(error) {

			console.log(error);
		}
}
