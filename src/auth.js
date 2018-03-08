/*

TO DO

*/


import * as firebase from "firebase";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyADTSEIDVq3GeCdNFmLq2VMMu_OzL0tsOI",
  authDomain: "buildit-codex.firebaseapp.com",
  databaseURL: "https://buildit-codex.firebaseio.com",
  projectId: "buildit-codex",
  storageBucket: "buildit-codex.appspot.com",
  messagingSenderId: "904105080552"
};
firebase.initializeApp(config);

import { 
	uiStrings, message
} from './ui.js';


/* ---- */


/** Authenticate user in Firebase
*/
export function authenticate( email, password ) {

/*
	firebase.auth().signInWithEmailAndPassword(email, password)
	    .catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  if (errorCode === 'auth/wrong-password') {
	    alert('Wrong password.');
	  } else {
	    alert(errorMessage);
	  }
	  console.log(error);
	});
*/
}
