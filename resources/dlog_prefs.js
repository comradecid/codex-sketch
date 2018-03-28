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


// TMP
window.tmpVal = function( value ){

	document.getElementById('form_authSignin').disabled = true;
	document.getElementById('form_authSignin_hint').innerHTML = value;
}


/* ---- */


/** Initialise page content following onload
*/
document.addEventListener('DOMContentLoaded', function() {

  // Call for user authentication state
  window.checkAuth();
});


// TODO: Move this into onload?
// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function( event ) {
	
  event.preventDefault();
});


// TODO: Move this into onload?
// Listen for call to dismiss dialog
document.getElementById('ctrl_close').addEventListener('click', function () {
	
  pluginCall('dismiss');
});


/* ---- */


/** Handle callback _during_ our attempt to authenticate/de-authenticate
    @param {boolean} isChanging — Whether we're currently attempting to 
      auth/de-auth
*/
window.handleIsAuthChanging = function( isChanging ) {

  if (isChanging === true) {

    showSignLoading();
  
  } else {

    hideSignLoading();
  }
}


/** Handle callback after we call for user authentication state
    @param {boolean} isAuthenticated — Whether the user is signed in
*/
window.handleAuthCheck = function( isAuthenticated ) {

  if (isAuthenticated === true) {

    showSignoutForm();
  
  } else {

    showSigninForm();
  }
}


/* ---- */


// Attach handler to sign-in form
document.getElementById('field_authSignin').addEventListener('click', function () {

  // Hide error
  document.getElementById('status').style.display = 'none';
  
  let email = document.getElementById('field_email').value;
  let password = document.getElementById('field_password').value;
  
  if (window.signIn(email, password) === true) {

    showSignoutForm();
  
  } else {

    showSigninForm();
  }
});


// Attach handler to sign-out form
document.getElementById('field_authSignout').addEventListener('click', function () {

  // Sign user out
  window.signOut();
  showSigninForm();
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
	
	setSubfields('form_useIgnoreFlag');
}


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


// Update UI to show sign-in form
function showSigninForm() {

  // Hide sign-out form
  document.getElementById('form_signout').style.display = 'none';
  // Show sign-in form
  document.getElementById('form_signin').style.display = 'table';
}


// Update UI to show sign-out form
function showSignoutForm() {

  // Hide sign-in form
  document.getElementById('form_signin').style.display = 'none';
  // Show sign-out form
  document.getElementById('form_signout').style.display = 'table';
}


// Update UI to indicate that we're now doing an auth change
function showSignLoading() {

  // Show loading indicator
  document.getElementById('loading').style.display = 'block';
}


// Update UI to indicate that we aren't doing an auth change anymore
function hideSignLoading() {

  // Hide loading indicator
  document.getElementById('loading').style.display = 'none';
}


// Toggle subfield display
document.getElementById('form_useIgnoreFlag').addEventListener('click', function () {
	
  setSubfields('form_useIgnoreFlag');
});


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
