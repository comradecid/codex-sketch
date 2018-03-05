/*

FILE-MANAGEMENT RESOURCES ONLY


TO DO

- Add in optional file overwrite confirmation check for writeDataToFile
- Add in error catch if we don't have a valid string to write to file for 
  writeDataToFile
- Determine which functions need to be exported, and which can stay private

*/


import { 
	uiStrings
} from './ui.js';

// Other constants
const OUTPUT_FILENAME = 'codex_output.json';


/* ---- */


/** Get parent directory for this plugin (usually the Sketch plugin directory)
	  [!] If you're using an alias to point to your plugin, results may vary!
    @param {object} context — Current context
    @return {string} Path of parent dir
*/
export function getPluginsDir( context ) {

	if (context !== undefined) {
		
		let path = context.scriptPath.stringByDeletingLastPathComponent();
		let parts = path.split('/');
		
		let numParts = parts.length - 3; // -3 parts to tunnel out of plugin itself
		path = '';
		
		for (let i = 1; i < numParts; i++) {
			
			path += '/' + parts[i];
		}
		
		return path + '/';
		
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + 'Missing context');
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
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_FILEPATH_NULL);
	}
}


/* ---- */


/** Write JSON data (in string format) to target file
	  [!] Performs basic variable checks, but does not validate
	  [!] Will overwrite target file if it already exists!
    @param {string} data - JSON data to write; stringifies as needed
    @param {string} path - Filepath to write to
*/
export function writeDataToFile( data, path, filename ) {

	if ((data !== undefined) && 
		  (path !== undefined) && (filename !== undefined)) {

		// Double-check value just in case it got munged due to eval
		if ((typeof data) === 'object') {

			data += '';
		}

		// We need to write a string to the file; if we have one, proceed
		if ((typeof data) === 'string') {

			// Format content string and path
			let content = 
				NSString.stringWithString(data);
			let formattedContent = 
				NSString.stringWithFormat("%@", content);
			let formattedPath = 
				NSString.stringWithFormat("%@", path + filename);

			// Write to file
			formattedContent.writeToFile_atomically_encoding_error(
				formattedPath, true, NSUTF8StringEncoding, null);
		}
	
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_DATAWRITE_NULL);
	}
}


/* ---- */


/** Read JSON data from target file
	  [!] Performs basic variable checks, but does not validate
	  [!] Will return empty object if file does not exist!
    @param {string} path - Filepath to write to
    @return {object} — File contents
*/
export function readDataFromFile( path ) {
	
	if (path !== undefined) {
		
		try {

			let formattedPath = 
				NSString.stringWithFormat("%@", path);
			return NSString.stringWithContentsOfFile_encoding_error(
				formattedPath, NSUTF8StringEncoding, null);

		} catch(error) {

			console.log(uiStrings.CONSOLE_ERR_PRFX + error);
		}
		
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + 'Missing path');
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
