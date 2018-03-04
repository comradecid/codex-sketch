/*

FILE-MANAGEMENT RESOURCES ONLY

TO DO

- Add in optional file overwrite confirmation check for writeDataToFile
- Add in error catch if we don't have a valid string to write to file for 
  writeDataToFile

*/


import { 
	CONSOLE_ERR_PRFX, ERR_DATAWRITE_NULL, ERR_FILEPATH_NULL, OUTPUT_FILENAME
} from './ui.js';


/* ---- */
  

/*
function readFile(path) {
    return NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, null);
}

function writeFile(path, content) {
    const string = NSString.stringWithFormat("%@", content);
    return string.writeToFile_atomically(path, true);
}
*/

/*
	  NSFileManager *fileManager = [[NSFileManager alloc] init];
    NSString *fontPath = [[paths objectAtIndex:0] stringByAppendingPathComponent:@"Fonts"];
 
    if ([fileManager fileExistsAtPath:path isDirectory:&isDir])
*/


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
		
		console.log(CONSOLE_ERR_PRFX + 'Missing context');
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
		
		console.log(CONSOLE_ERR_PRFX + ERR_FILEPATH_NULL);
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

			//jsonString = JSON.stringify(data, null, "\t");
// TODO: Figure out why stringify doesnt work with above params
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
		
		console.log(CONSOLE_ERR_PRFX + ERR_DATAWRITE_NULL);
	}
}
