/*

Requires use of 'userauth_for_dlogs.js'

TO DO

...

*/


// SKPM resources to communication between webview and plugin
import pluginCall from 'sketch-module-web-view/client';


/* ---- */


/** Initialise page content following onload
*/
document.addEventListener('DOMContentLoaded', function() {

  // Call for user authentication state
  window.checkAuth();
});


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


// Listen for call to dismiss dialog
document.getElementById('ctrl_close').addEventListener('click', function () {
	
  pluginCall('dismiss');
});


/* ---- */


function showSigninForm() {

  // Hide sign-out form
  document.getElementById('form_signout').style.display = 'none';
  // Show sign-in form
  document.getElementById('form_signin').style.display = 'table';
}


function showSignoutForm() {

  // Hide sign-in form
  document.getElementById('form_signin').style.display = 'none';
  // Show sign-out form
  document.getElementById('form_signout').style.display = 'table';
}


function showSignLoading() {

  // Show loading indicator
  document.getElementById('loading').style.display = 'block';
}


function hideSignLoading() {

  // Hide loading indicator
  document.getElementById('loading').style.display = 'none';
}


/* ---- */

// TMP
// Replace with more formal inline error-reporting method
window.konsol = function( message ) {

  document.getElementById('konsol').innerHTML += message + '<br/>';
}
