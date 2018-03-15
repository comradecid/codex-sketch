/*

TO DO

*/


import message from './ui.js';

//import * as firebase from "firebase";
//var firebase = require("firebase");

//global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;


// Initialize Firebase
const config = {
  apiKey: "AIzaSyADTSEIDVq3GeCdNFmLq2VMMu_OzL0tsOI",
  authDomain: "buildit-codex.firebaseapp.com",
  databaseURL: "https://buildit-codex.firebaseio.com",
  projectId: "buildit-codex",
  storageBucket: "buildit-codex.appspot.com",
  messagingSenderId: "904105080552"
};
//firebase.initializeApp(config);

const ERR_WRONG_PWD = 'auth/wrong-password';


/* ---- */


/** Authenticate user in Firebase
*/
export function authenticateUser( email, password ) {

	if ((email !== undefined) && (password !== undefined)) {
	
		try {

// This still breaks with the error:
// console> Error: The XMLHttpRequest compatibility library was not found.		
			// firebase.auth().signInWithEmailAndPassword(email, password)
			//   .catch(function(error) {
	
			// 	  // Handle errors according to type
			// 	  let errorCode = error.code;
			// 	  let errorMessage = error.message;
				  
			// 	  if (errorCode === ERR_WRONG_PWD) {
					
			// 	    console.log('Wrong password, dumbass.');
				  
			// 	  } else {
					
			// 	    console.log(errorMessage);
			// 	  }
				  
			// 	  console.log(error);
			// });
		
		} catch( error ) {
			
			console.log(error);
		}

	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + 'Missing email and/or password');
	}
}
