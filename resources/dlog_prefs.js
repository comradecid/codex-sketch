/*

TO DO

*** - Build in basic inline validation for fields
*** - Account for instances where sanitising a field leaves it empty
*** - Build in at least basic inline validation
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


// Toggle subfield display
document.getElementById('form_useIgnoreFlag').addEventListener('click', function () {
	
  setSubfields('form_useIgnoreFlag');
});


// Set up authentication control
document.getElementById('form_authSignin').addEventListener('click', function () {

	// TMP
	pluginCall('storeToken', 'token', '6661234');
	pluginCall('retrieveToken', 'token');
});


// TMP
window.tmpVal = function( value ){

	document.getElementById('form_authSignin').disabled = true;
	document.getElementById('form_authSignin_hint').innerHTML = value;
}

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
	
	setSubfields('form_useIgnoreFlag');
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
			jsonSanitize(document.getElementById('form_ignoreFlag').value);
		
		// Use debugging tools
		window.formData.useDebugging = 
		 	document.getElementById('form_useDebugging').checked;
		
		return JSON.stringify(window.formData);
	}
}


/* ---- */


/** Local utility function: Show/hide subfields for target form element
    @param {string} id — Id of form element for which to handle subfield display
*/
function setSubfields( id ) {

  let elem = document.getElementById(id);
  
	if ((id !== undefined) && (elem !== null)) {
	
		switch(id) {
			
			case 'form_useIgnoreFlag':
			  document.getElementById('useIgnoreFlag_0').style.display = 
			  	(elem.checked) ? 'table-row' : 'none';
				break;
		}
	}
}


/* ---- */


/** Local utility: sanitise input, to avoid JSON breakages
		Strip any potentially dangerous characters: [,],{,},:,,
*/
function jsonSanitize( value ) {
	
	if (value !== undefined) {
		
		let newValue = value.toString();
		let illegalChars = [
			/\[/g, /\]/g, /{/g, /}/g, /;/g, /,/g
		];
		let numIllegalChars = illegalChars.length;
		
		for (let i = 0;  i < numIllegalChars; i++) {
			
			newValue = newValue.replace(illegalChars[i], '');
		}
		
		return newValue;
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
