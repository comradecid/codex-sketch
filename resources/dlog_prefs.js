/*

TO DO

*** - Build in basic inline validation for fields
- Build in error-checking for loadFormValues, in case a given property in the 
  data set doesn't already exist?

*/


import pluginCall from 'sketch-module-web-view/client';


/* ---- */


// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function( e ) {
	
  e.preventDefault();
});


// Listen for call to dismiss dialog
document.getElementById('ctrl_close').addEventListener('click', function () {
	
  pluginCall('dismiss');
});


/* ---- */
  

/** Populate form fields on screen
    @param {object} data - Data with which to populate form fields
*/
window.loadFormValues = function( data ) {

	if (data !== undefined) {
		
		// Due to varying means of respresenting value on each field, 
		// set each individually
		
		// Use 'ignore' flag
		document.getElementById('form_useIgnoreFlag').checked = data.useIgnoreFlag;
		
		// 'Ignore' flag
		document.getElementById('form_ignoreFlag').value = data.ignoreFlag;
		
		// Use debugging tools
		document.getElementById('form_useDebugging').checked = data.useDebugging;

		// Tack this on to the window for later use
		window.formData = data;
	}
}


/* ---- */
  

/** Read and store form field values on screen
    @return {object} - Exported form data
*/
window.getFormValues = function() {
	
	if (window.formData !== undefined) {
	
		// Due to varying means of respresenting value on each field, 
		// get each individually
		
		// Use 'ignore' flag
		window.formData.useIgnoreFlag = 
			document.getElementById('form_useIgnoreFlag').checked;
		
		// 'Ignore' flag
		window.formData.ignoreFlag = 
			document.getElementById('form_ignoreFlag').value;
		
		// Use debugging tools
		window.formData.useDebugging = 
		 	document.getElementById('form_useDebugging').checked;
		
		return JSON.stringify(window.formData);
	}
}


/* ---- */


/*
// Listen for unload of document in webview
window.addEventListener('load', function () {
	
  pluginCall('foobar', 'window loaded');
});

// Listen for unload of document in webview
window.addEventListener('pageshow', function () {
	
  pluginCall('foobar', 'window shown');
});

// Listen for unload of document in webview
window.addEventListener('blur', function () {
	
  pluginCall('foobar', 'window blurred');
});
*/
