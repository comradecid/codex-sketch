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
