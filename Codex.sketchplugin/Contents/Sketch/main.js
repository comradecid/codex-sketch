var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console) {/* globals log */

if (true) {
  var sketchUtils = __webpack_require__(5)
  var sketchDebugger = __webpack_require__(7)
  var actions = __webpack_require__(9)

  function getStack() {
    return sketchUtils.prepareStackTrace(new Error().stack)
  }
}

console._skpmPrefix = 'console> '

function logEverywhere(type, args) {
  var values = Array.prototype.slice.call(args)

  // log to the System logs
  values.forEach(function(v) {
    try {
      log(console._skpmPrefix + indentString() + v)
    } catch (e) {
      log(v)
    }
  })

  if (true) {
    if (!sketchDebugger.isDebuggerPresent()) {
      return
    }

    var payload = {
      ts: Date.now(),
      type: type,
      plugin: String(context.scriptPath),
      values: values.map(sketchUtils.prepareValue),
      stack: getStack(),
    }

    sketchDebugger.sendToDebugger(actions.ADD_LOG, payload)
  }
}

var indentLevel = 0
function indentString() {
  var indent = ''
  for (var i = 0; i < indentLevel; i++) {
    indent += '  '
  }
  if (indentLevel > 0) {
    indent += '| '
  }
  return indent
}

var oldGroup = console.group

console.group = function() {
  // log to the JS context
  oldGroup && oldGroup.apply(this, arguments)
  indentLevel += 1
  if (true) {
    sketchDebugger.sendToDebugger(actions.GROUP, {
      plugin: String(context.scriptPath),
      collapsed: false,
    })
  }
}

var oldGroupCollapsed = console.groupCollapsed

console.groupCollapsed = function() {
  // log to the JS context
  oldGroupCollapsed && oldGroupCollapsed.apply(this, arguments)
  indentLevel += 1
  if (true) {
    sketchDebugger.sendToDebugger(actions.GROUP, {
      plugin: String(context.scriptPath),
      collapsed: true
    })
  }
}

var oldGroupEnd = console.groupEnd

console.groupEnd = function() {
  // log to the JS context
  oldGroupEnd && oldGroupEnd.apply(this, arguments)
  indentLevel -= 1
  if (indentLevel < 0) {
    indentLevel = 0
  }
  if (true) {
    sketchDebugger.sendToDebugger(actions.GROUP_END, {
      plugin: context.scriptPath,
    })
  }
}

var counts = {}
var oldCount = console.count

console.count = function(label) {
  label = typeof label !== 'undefined' ? label : 'Global'
  counts[label] = (counts[label] || 0) + 1

  // log to the JS context
  oldCount && oldCount.apply(this, arguments)
  return logEverywhere('log', [label + ': ' + counts[label]])
}

var timers = {}
var oldTime = console.time

console.time = function(label) {
  // log to the JS context
  oldTime && oldTime.apply(this, arguments)

  label = typeof label !== 'undefined' ? label : 'default'
  if (timers[label]) {
    return logEverywhere('warn', ['Timer "' + label + '" already exists'])
  }

  timers[label] = Date.now()
  return
}

var oldTimeEnd = console.timeEnd

console.timeEnd = function(label) {
  // log to the JS context
  oldTimeEnd && oldTimeEnd.apply(this, arguments)

  label = typeof label !== 'undefined' ? label : 'default'
  if (!timers[label]) {
    return logEverywhere('warn', ['Timer "' + label + '" does not exist'])
  }

  var duration = Date.now() - timers[label]
  delete timers[label]
  return logEverywhere('log', [label + ': ' + (duration / 1000) + 'ms'])
}

var oldLog = console.log

console.log = function() {
  // log to the JS context
  oldLog && oldLog.apply(this, arguments)
  return logEverywhere('log', arguments)
}

var oldWarn = console.warn

console.warn = function() {
  // log to the JS context
  oldWarn && oldWarn.apply(this, arguments)
  return logEverywhere('warn', arguments)
}

var oldError = console.error

console.error = function() {
  // log to the JS context
  oldError && oldError.apply(this, arguments)
  return logEverywhere('error', arguments)
}

var oldAssert = console.assert

console.assert = function(condition, text) {
  // log to the JS context
  oldAssert && oldAssert.apply(this, arguments)
  if (!condition) {
    return logEverywhere('assert', [text])
  }
  return undefined
}

var oldInfo = console.info

console.info = function() {
  // log to the JS context
  oldInfo && oldInfo.apply(this, arguments)
  return logEverywhere('info', arguments)
}

var oldClear = console.clear

console.clear = function() {
  oldClear && oldClear()
  if (true) {
    return sketchDebugger.sendToDebugger(actions.CLEAR_LOGS)
  }
}

console._skpmEnabled = true

module.exports = console

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */

module.exports = function prepareStackTrace(stackTrace) {
  var stack = stackTrace.split('\n')
  stack = stack.map(function (s) {
    return s.replace(/\sg/, '')
  })

  stack = stack.map(function (entry) {
    // entry is something like `functionName@path/to/my/file:line:column`
    // or `path/to/my/file:line:column`
    // or `path/to/my/file`
    // or `path/to/@my/file:line:column`
    var parts = entry.split('@')
    var fn = parts.shift()
    var filePath = parts.join('@') // the path can contain @

    if (fn.indexOf('/Users/') === 0) {
      // actually we didn't have a fn so just put it back in the filePath
      filePath = fn + (filePath ? ('@' + filePath) : '')
      fn = null
    }

    if (!filePath) {
      // we should always have a filePath, so if we don't have one here, it means that the function what actually anonymous and that it is the filePath instead
      filePath = entry
      fn = null
    }

    var filePathParts = filePath.split(':')
    filePath = filePathParts[0]

    // the file is the last part of the filePath
    var file = filePath.split('/')
    file = file[file.length - 1]

    return {
      fn: fn,
      file: file,
      filePath: filePath,
      line: filePathParts[1],
      column: filePathParts[2],
    }
  })

  return stack
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function toArray(object) {
  if (Array.isArray(object)) {
    return object
  }
  var arr = []
  for (var j = 0; j < (object || []).length; j += 1) {
    arr.push(object[j])
  }
  return arr
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports['default'] = function (context) {

	// Identifiers
	var LAYER_TYPE_SYMBOL_INSTANCE = 'MSSymbolInstance';
	var LAYER_TYPE_SYMBOL_MASTER = 'MSSymbolMaster';
	var SYMBOL_IGNORE_FLAG = '#';

	// Main sketch objects and other resources
	var sketch = context.api();
	var selectedLayers = sketch.selectedDocument.selectedPage.selectedLayers;
	var foundSymbols = []; // Container to hold selected symbols

	/* ---- */

	// If this layer is a symbol master, recurse through it and grab any other
	// children that are dependent symbols
	// If this layer is a symbol instance, grab its master and use that for 
	// recursive examination
	// TODO: How do we deal with local overrides?
	function processLayer(layer) {

		var layerClass = layer.sketchObject.className();

		// If this is a symbol...
		// TODO: handle diffs between instances and masters
		// TODO: Recurse this!
		if (layerClass == LAYER_TYPE_SYMBOL_INSTANCE || layerClass == LAYER_TYPE_SYMBOL_MASTER) {

			// Get name of symbol first, to determine if it should be ignored
			var layerName = String(layer.sketchObject.name());

			// Get JSON for selected symbol
			// If name includes ignore flag, ignore it; otherwise, ready it for sync
			// TODO: Non-JSON formatting of symbols collection info can lead to parse errors
			var jsonString = (0, _ui.getLayerJSON)(layer);
			foundSymbols.push(jsonString);
		}
	}

	/* ---- */

	// If user has selected at least one item...
	if (selectedLayers.length > 0) {

		// Traverse selected layer(s) to gather symbol information
		selectedLayers.iterate(function (layer) {
			processLayer(layer);
		});

		// If we have symbols to sync, proceed; 
		// if not, we risk errors when syncing/dumping the data
		var numSymbols = foundSymbols.length;
		if (numSymbols > 0) {

			// Load confirmation dialog, capturing click event
			var clickEvent = (0, _ui.getConfirmation)(sketch, foundSymbols);

			// If user has opted to continue...
			if (clickEvent == NSAlertFirstButtonReturn) {

				// Debug: dump JSON to file, instead of pushing to server
				if (DEBUG) {

					(0, _ui.dumpToOutputFile)(JSON.stringify(foundSymbols, null, "\t"));
				} else {

					// Push it to server
				}
			}

			// User has selected at least one layer, but none are symbols
			// TODO: Catch for when we have at least one symbol, but all are 'ignored'
		} else {

			sketch.message(_ui.MSG_SELECT_SYMBOL);
		}

		// User hasn't selected anything
	} else {

		sketch.message(_ui.MSG_SELECT_SYMBOL);
	}
};

var _ui = __webpack_require__(4);

__webpack_require__(10);

// Debugging
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

*/

var DEBUG = true;

/* ---- */

/**
 *  Primary parsing + syncing function
 *  - Checks for selected symbols
 *  - Traverses selected symbols contents recursively for sub-symbols
 *  - Assembles syncable information into JSON set
 *  - Delivers JSON to server for further processing
 */

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console) {Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getLayerJSON = getLayerJSON;
exports.formatFilePath = formatFilePath;
exports.getConfirmation = getConfirmation;
exports.dumpToOutputFile = dumpToOutputFile;
// UI strings and values
var CONSOLE_ERR_PRFX = '[CODEX](ERR) ';
var ERR_CONFDLOG_NULL = 'Sketch API and/or symbol set not provided';
var ERR_FILEPATH_NULL = 'No path provided';
var ERR_JSONSTR_NULL = 'JSON string not provided';
var ERR_LAYER_NULL = 'No layer provided';
var LBL_CANCEL = 'Cancel';
var LBL_CHOOSE = 'Choose';
var LBL_CONTINUE = 'Continue';
var LBL_TITLE_CONFIRM_UPDATE = 'Confirm style guide update';
var MSG_CONFIRM_UPDATE = 'Would you like to update the style guide with the following symbols?';
var MSG_CONFIRM_IGNORE = 'The following symbols will be ignored, and not synced with the style guide:';
var MSG_SELECT_SYMBOL = 'Please select at least one symbol.';
var ICON_FILE = 'icon_128x128.png';
var OUTPUT_FILENAME = 'hydra_output.json';
var LBL_LINEITEM = ' · ';
var SYMBOL_IGNORE_FLAG = '#';

// TMP: Make certain consts available elsewhere
exports.MSG_SELECT_SYMBOL = MSG_SELECT_SYMBOL;

/* ---- */

/** Get corresponding JSON data for layer object
    @param {object} layer - Layer object to process
    @return {string} Stringified JSON
*/

function getLayerJSON(layer) {

	if (layer !== undefined) {

		try {

			var dict = layer.sketchObject.treeAsDictionary();
			var jsonData = NSJSONSerialization.dataWithJSONObject_options_error_(dict, 0, nil);
			var jsonString = NSString.alloc().initWithData_encoding_(jsonData, NSUTF8StringEncoding);

			return jsonString;
		} catch (error) {

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
function formatFilePath(path) {

	if (path !== undefined) {

		path = path.toString();
		return 0 === path.indexOf("file://") ? path.substring(7) : path;
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
function getConfirmation(sketch, symbols) {

	if (sketch !== undefined && symbols !== undefined) {

		try {

			var iconPath = formatFilePath(sketch.resourceNamed(ICON_FILE));
			var iconImage = NSImage.alloc().initWithContentsOfFile(iconPath);

			// Set up confirmation dialog
			var alert = NSAlert.alloc().init();
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
			var message = MSG_CONFIRM_UPDATE + '\n\n';
			var name = '';
			var numSymbols = symbols.length;
			var ignoreList = [];
			var numIgnores = void 0;

			for (var i in symbols) {

				// Parse stringified JSON back into real JSON, 
				// both to read values and allow for file dump later
				// TODO: Possibly hide actual symbol names, and move this to debug
				symbols[i] = JSON.parse(symbols[i]);
				name = symbols[i].name;

				// If 'ignore' flag is found, add this to the 'ignore' list
				if (0 === name.indexOf(SYMBOL_IGNORE_FLAG)) {

					ignoreList.push(symbols[i].name);
				} else {

					message += i > 0 ? LBL_LINEITEM : '';
					message += symbols[i].name;
				}
			}

			numIgnores = ignoreList.length;
			if (numIgnores > 0) {

				message += '\n\n' + MSG_CONFIRM_IGNORE + '\n\n';

				for (var _i in ignoreList) {

					message += _i > 0 ? LBL_LINEITEM : '';
					message += ignoreList[_i];
				}
			}

			message += '\n';
			alert.setInformativeText(message);

			return alert.runModal();
		} catch (error) {

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
function dumpToOutputFile(jsonString) {

	if (jsonString !== undefined) {

		try {

			// NOTE: Currently, this will automatically overwrite any 
			// existing dumpfiles, and does not accept name changes
			// Always uses same filename, as set by global var
			// TODO: Add in overwrite confirmation?

			// Set up 'select folder' dialog options, as Sketch API does not 
			// currently support file dialogs
			var panel = NSOpenPanel.openPanel();
			panel.setCanChooseDirectories(true);
			panel.setCanCreateDirectories(true);
			panel.setCanChooseFiles(false);
			panel.setPrompt(LBL_CHOOSE);

			// Load file save dialog, capturing click event
			var clickEvent = panel.runModal();

			// If user has opted to continue...
			if (clickEvent == NSFileHandlingPanelOKButton) {

				// Get target directory path
				var dirURL = panel.URL();
				dirURL = formatFilePath(dirURL);

				// TODO: Figure out why this is randomly so slow
				// TODO: Figure out why stringify is failing on foundSymbols
				var content = NSString.stringWithString(jsonString);
				var t = NSString.stringWithFormat("%@", content);
				var f = NSString.stringWithFormat("%@", dirURL + OUTPUT_FILENAME);
				t.writeToFile_atomically_encoding_error(f, true, NSUTF8StringEncoding, null);
			}
		} catch (error) {

			console.log(CONSOLE_ERR_PRFX + error);
		}
	} else {

		console.log(CONSOLE_ERR_PRFX + ERR_JSONSTR_NULL);
	}
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var prepareValue = __webpack_require__(6)

module.exports.toArray = __webpack_require__(2)
module.exports.prepareStackTrace = __webpack_require__(1)
module.exports.prepareValue = prepareValue
module.exports.prepareObject = prepareValue.prepareObject
module.exports.prepareArray = prepareValue.prepareArray


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */
var prepareStackTrace = __webpack_require__(1)
var toArray = __webpack_require__(2)

function prepareArray(array, options) {
  return array.map(function(i) {
    return prepareValue(i, options)
  })
}

function prepareObject(object, options) {
  const deep = {}
  Object.keys(object).forEach(function(key) {
    deep[key] = prepareValue(object[key], options)
  })
  return deep
}

function getName(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.name()),
  }
}

function getSelector(x) {
  return {
    type: 'String',
    primitive: 'String',
    value: String(x.selector()),
  }
}

function introspectMochaObject(value, options) {
  options = options || {}
  var mocha = value.class().mocha()
  var introspection = {
    properties: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['properties' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getName),
    },
    classMethods: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['classMethods' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getSelector),
    },
    instanceMethods: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['instanceMethods' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getSelector),
    },
    protocols: {
      type: 'Array',
      primitive: 'Array',
      value: toArray(
        mocha['protocols' + (options.withAncestors ? 'WithAncestors' : '')]()
      ).map(getName),
    },
  }
  if (mocha.treeAsDictionary && options.withTree) {
    introspection.treeAsDictionary = {
      type: 'Object',
      primitive: 'Object',
      value: prepareObject(mocha.treeAsDictionary())
    }
  }
  return introspection
}

function prepareValue(value, options) {
  var type = 'String'
  var primitive = 'String'
  const typeOf = typeof value
  if (value instanceof Error) {
    type = 'Error'
    primitive = 'Error'
    value = {
      message: value.message,
      name: value.name,
      stack: prepareStackTrace(value.stack),
    }
  } else if (Array.isArray(value)) {
    type = 'Array'
    primitive = 'Array'
    value = prepareArray(value, options)
  } else if (value === null || value === undefined || Number.isNaN(value)) {
    type = 'Empty'
    primitive = 'Empty'
    value = String(value)
  } else if (typeOf === 'object') {
    if (value.isKindOfClass && typeof value.class === 'function') {
      type = String(value.class())
      // TODO: Here could come some meta data saved as value
      if (
        type === 'NSDictionary' ||
        type === '__NSDictionaryM' ||
        type === '__NSSingleEntryDictionaryI' ||
        type === '__NSDictionaryI' ||
        type === '__NSCFDictionary'
      ) {
        primitive = 'Object'
        value = prepareObject(Object(value), options)
      } else if (
        type === 'NSArray' ||
        type === 'NSMutableArray' ||
        type === '__NSArrayM' ||
        type === '__NSSingleObjectArrayI' ||
        type === '__NSArray0'
      ) {
        primitive = 'Array'
        value = prepareArray(toArray(value), options)
      } else if (
        type === 'NSString' ||
        type === '__NSCFString' ||
        type === 'NSTaggedPointerString' ||
        type === '__NSCFConstantString'
      ) {
        primitive = 'String'
        value = String(value)
      } else if (type === '__NSCFNumber' || type === 'NSNumber') {
        primitive = 'Number'
        value = 0 + value
      } else if (type === 'MOStruct') {
        type = String(value.name())
        primitive = 'Object'
        value = value.memberNames().reduce(function(prev, k) {
          prev[k] = prepareValue(value[k], options)
          return prev
        }, {})
      } else if (value.class().mocha) {
        primitive = 'Mocha'
        value = (options || {}).skipMocha ? type : introspectMochaObject(value, options)
      } else {
        primitive = 'Unknown'
        value = type
      }
    } else {
      type = 'Object'
      primitive = 'Object'
      value = prepareObject(value, options)
    }
  } else if (typeOf === 'function') {
    type = 'Function'
    primitive = 'Function'
    value = String(value)
  } else if (value === true || value === false) {
    type = 'Boolean'
    primitive = 'Boolean'
  } else if (typeOf === 'number') {
    primitive = 'Number'
    type = 'Number'
  }

  return {
    value,
    type,
    primitive,
  }
}

module.exports = prepareValue
module.exports.prepareObject = prepareObject
module.exports.prepareArray = prepareArray


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign, no-var, vars-on-top, prefer-template, prefer-arrow-callback, func-names, prefer-destructuring, object-shorthand */
var remoteWebview = __webpack_require__(8)

module.exports.identifier = 'skpm.debugger'

module.exports.isDebuggerPresent = remoteWebview.isWebviewPresent.bind(
  this,
  module.exports.identifier
)

module.exports.sendToDebugger = function sendToDebugger(name, payload) {
  return remoteWebview.sendToWebview(
    module.exports.identifier,
    'sketchBridge(' +
      JSON.stringify({
        name: name,
        payload: payload,
      }) +
      ');'
  )
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/* globals NSThread */

var threadDictionary = NSThread.mainThread().threadDictionary()

module.exports.isWebviewPresent = function isWebviewPresent (identifier) {
  return !!threadDictionary[identifier]
}

module.exports.sendToWebview = function sendToWebview (identifier, evalString) {
  if (!module.exports.isWebviewPresent(identifier)) {
    throw new Error('Webview ' + identifier + ' not found')
  }

  var webview = threadDictionary[identifier]
    .contentView()
    .subviews()
  webview = webview[webview.length - 1]

  return webview.stringByEvaluatingJavaScriptFromString(evalString)
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports.SET_TREE = 'elements/SET_TREE'
module.exports.SET_PAGE_METADATA = 'elements/SET_PAGE_METADATA'
module.exports.SET_LAYER_METADATA = 'elements/SET_LAYER_METADATA'
module.exports.ADD_LOG = 'logs/ADD_LOG'
module.exports.CLEAR_LOGS = 'logs/CLEAR_LOGS'
module.exports.GROUP = 'logs/GROUP'
module.exports.GROUP_END = 'logs/GROUP_END'
module.exports.TIMER_START = 'logs/TIMER_START'
module.exports.TIMER_END = 'logs/TIMER_END'
module.exports.ADD_REQUEST = 'network/ADD_REQUEST'
module.exports.SET_RESPONSE = 'network/SET_RESPONSE'
module.exports.ADD_ACTION = 'actions/ADD_ACTION'
module.exports.SET_SCRIPT_RESULT = 'playground/SET_SCRIPT_RESULT'


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(console) {Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getLayerJSON = getLayerJSON;
// UI strings and values
var CONSOLE_ERR_PRFX = '[CODEX](ERR) ';
var ERR_CONFDLOG_NULL = 'Sketch API and/or symbol set not provided';
var ERR_FILEPATH_NULL = 'No path provided';
var ERR_JSONSTR_NULL = 'JSON string not provided';
var ERR_LAYER_NULL = 'No layer provided';
var LBL_CANCEL = 'Cancel';
var LBL_CHOOSE = 'Choose';
var LBL_CONTINUE = 'Continue';
var LBL_TITLE_CONFIRM_UPDATE = 'Confirm style guide update';
var MSG_CONFIRM_UPDATE = 'Would you like to update the style guide with the following symbols?';
var MSG_CONFIRM_IGNORE = 'The following symbols will be ignored, and not synced with the style guide:';
var MSG_SELECT_SYMBOL = 'Please select at least one symbol.';
var ICON_FILE = 'icon_128x128.png';
var OUTPUT_FILENAME = 'hydra_output.json';
var LBL_LINEITEM = ' · ';
var SYMBOL_IGNORE_FLAG = '#';

// TMP: Make certain consts available elsewhere
exports.MSG_SELECT_SYMBOL = MSG_SELECT_SYMBOL;

/* ---- */

/** Get corresponding JSON data for layer object
    @param {object} layer - Layer object to process
    @return {string} Stringified JSON
*/

function getLayerJSON(layer) {

	if (layer !== undefined) {

		try {

			var dict = layer.sketchObject.treeAsDictionary();
			var jsonData = NSJSONSerialization.dataWithJSONObject_options_error_(dict, 0, nil);
			var jsonString = NSString.alloc().initWithData_encoding_(jsonData, NSUTF8StringEncoding);

			return jsonString;
		} catch (error) {

			console.log(CONSOLE_ERR_PRFX + error);
		}
	} else {

		console.log(CONSOLE_ERR_PRFX + ERR_LAYER_NULL);
	}
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')
