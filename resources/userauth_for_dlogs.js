
// SKPM resources to communication between webview and plugin
import pluginCall from 'sketch-module-web-view/client';

// [!] This currently requires a direct call from a script tag on the html page 
//     pointing to the Google-hosted Firebase script in order to work; this is 
//     due to breakages that occur when one attempts to include the Firebase 
//     code as a Node module. Thus, all calls from scripts backing up a webview 
//     requiring authentication must go through this script, which in turn calls
//     the core plugin code to reach state variables.

// Other constants
const TOKEN_URL = 'https://us-central1-buildit-codex.cloudfunctions.net/CCT';
// const ERR_WRONG_PWD = 'auth/wrong-password';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyADTSEIDVq3GeCdNFmLq2VMMu_OzL0tsOI",
  authDomain: "buildit-codex.firebaseapp.com",
  databaseURL: "https://buildit-codex.firebaseio.com",
  projectId: "buildit-codex",
  storageBucket: "buildit-codex.appspot.com",
  messagingSenderId: "904105080552"
};


// TODO: Find a better place to store these?
var userAuthenticated = false;
var userToken = '';
var userId;


/* ---- */


firebase.initializeApp(config);

// TODO: Code below assumes that this is fired again when we successfully sign 
// in user via token — is this true??
firebase.auth().onAuthStateChanged(function(user) {

  // If the user is now signed in, check for remaining auth state conditions
  if (user) {

    // Get + temporarily store user.uid
    userId = user.uid;

    // If we don't have a local copy of the token, go get one, and continue with
    // auth state set as 'false'
    if (userToken === '') {

      // Use user.uid to get new token
      getCustomToken(userId);

    // If we already have a local copy of a token, and the user is signed in, 
    // set auth state to 'true'
    } else {

      userAuthenticated = true;
    }

  // If user is now signed out, clear local vars and update UI
  } else {

    // Reset local auth state vars
    userAuthenticated = false;
    userToken = '';
    userId = null;

    // No user is signed in
    window.handleAuthCheck(false);
  }
});


/* ---- */

// [!] Because this requires calls to the plugin (which cant return values 
//     directly), we need to make sure there are corresponding handlers in the 
//     receiving script
window.checkAuth = function() {

  // 'userAuthenticated' will only be true if all critical user info is available
  if (userAuthenticated === true) {

    // Call appropriate handler in script backing up html page
    window.handleAuthCheck(true);

  // If not, begin deeper dive
  } else {

    // Do we have a custom token for the user?
    pluginCall('checkToken');
  }
}


/** Handle callback after we call for custom token for user
    @param {string} token — Custom token for user, pulled from app settings
*/
window.handleTokenCheck = function( token ) {

  // General truthy check for some value returned from the call
  if (token && (token !== 'null')) {

    // If we have a token, try it out to see if it works;
    // either way, the success/fail of this attempt will is handled by 
    // 'onAuthStateChanged' listener attached to firebase above
    firebase.auth().signInWithCustomToken(token).then(function() {

        // Execute additional code right after sign-in call

      }).catch(function(error) {

        // Handle errors according to type
        let errorCode = error.code;
        let errorMessage = error.message;
        
        //document.innerHTML += '<hr />' + error + '<br/>';
    });
  
  // If we got nothing useful back...
  } else {

    // Call appropriate handler in script backing up html page
    window.handleAuthCheck(false);
  }
}


/* ---- */


window.signIn = function( email, password ) {

	if ((email !== undefined) && (password !== undefined)) {
  
    window.handleIsAuthChanging(true);

		try {

			firebase.auth().signInWithEmailAndPassword(email, password)
			  .catch(function(error) {
	
				  // Handle errors according to type
				  let errorCode = error.code;
				  let errorMessage = error.message;
				  
				  if (errorCode === ERR_WRONG_PWD) {
					
            //document.innerHTML += '<hr />WRONG PASSWORD<br/>';
				  
				  } else {
					
            //document.innerHTML += '<hr />ERROR SIGNING IN<br/>';
				  }
				  
          window.handleIsAuthChanging(false);
			});
		
		} catch( error ) {
			
      window.handleIsAuthChanging(false);
		}

	} else {
		
    window.handleIsAuthChanging(false);
	}

  return true;
}


/* ---- */


window.signOut = function() {

  firebase.auth().signOut().then(function() {
      
      // Wipe token value stored in app settings
      pluginCall('wipeToken');
      
    }).catch(function(error) {

      // Handle errors according to type
      let errorCode = error.code;
      let errorMessage = error.message;
      
      //document.innerHTML += '<hr />' + error + '<br/>';
    });
}


/* ---- */


/** Get custom token to be used for sign-in later
*/
// TODO: How get failure for this if we never get readystate==4?
function getCustomToken( uid ) {

  if (uid !== undefined) {
  
    var data = JSON.stringify({
      "uid": uid
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {

        if (this.status === 200) {

          // Store this token in user app settings
          userToken = this.responseText;
          pluginCall('storeToken', userToken);

          // Call appropriate handler in script backing up html page
          window.handleAuthCheck(true);

        } else {
        
          // Call appropriate handler in script backing up html page
          window.handleAuthCheck(false);
        }
      }
    });

    xhr.open("POST", "https://us-central1-buildit-codex.cloudfunctions.net/CCT");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);
 }
}
