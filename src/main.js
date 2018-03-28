/*

MENU COMMANDS

Due to extensive information-sharing across various menu commands, all are 
consolidated here to make delegation easier


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

- skpm/sketch-module-web-view for generating webview-based windows for 
  interacting with the user
  More info: https://github.com/skpm/sketch-module-web-view


TO DO

*** - Webview windows can't currently behave modally; prevent this script from 
  breaking if user has accidentally dismissed document window but not update 
  dlog
*** - Fix data format dump to file
*** - Examine v49 API changes and make revisions to code accordingly
- Remove double-write to syncSymbols, ignoreSymbolNames?
- How do we deal with local overrides?
- Handle diffs between instances and masters
- Recurse symbol processing
- In case we can't support modal behaviour for windows, consider the use of key 
  actions for certain handling: openDocument, closeDocument, saveDocument, etc.
- Examine where action-driven scripts could make certain intelligibility and 
  maintencance of the the code easier (ex: startup -> declare global resources, 
  check authentication, preload prefs, etc.)
- Remove unnecessary try/catch instances
*/


// Main Sketch API include; as we require a broad swath of functionality, pulls in everything
//import * as sketch from 'sketch';

// Plugin-specific UI resources
import {
  getConfirmation, getUpdateConfirmationContent, 
  showPreferencesDlog, showAboutDlog
} from './ui.js';

// Data-processing resources
import {
  getPluginsDir, processSelection
} from './data.js';

// Other globals
global.pluginsDirPath = '';

//global.curUserConfig = {};


/* ---- */


/** Handler for on-startup initialisation
*/
export function onStartup( context ) {

  // Get location of this plugin
  pluginsDirPath = getPluginsDir(context);

  // Load user preferences
  //curUserConfig = loadPrefs();
}


/* ---- */


/** Handler for menu command 'update'
*/
export function runUpdate( context ) {

  try {
  
    let processedSelection = processSelection();

    // TMP
    // If we have items to sync with the style guide, inform the user
    //if (processedSelection.hasOwnProperty('syncItems')) {

     // getConfirmation(getUpdateConfirmationContent(processedSelection));
    //}

  } catch(error) {
  
    console.log(error);
  }
}


/* ---- */


/** Handler for menu command 'prefs'
*/
export function runPreferences( context ) {

  showPreferencesDlog();
}


/* ---- */


/** Handler for menu command 'about'
*/
export function runAbout( context ) {

  showAboutDlog();
}
