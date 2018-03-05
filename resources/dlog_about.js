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
