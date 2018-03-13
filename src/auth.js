/*

TO DO

*/


import { 
	uiStrings, message
} from './ui.js';

const ERR_WRONG_PWD = 'auth/wrong-password';


/* ---- */


/** Authenticate user in Firebase
*/
export function authenticateUser( email, password ) {

	if ((email !== undefined) && (password !== undefined)) {
	
		try {
		
			// Authorise user
		
		} catch( error ) {
			
			console.log(error);
		}

	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + 'Missing email and/or password');
	}
}
