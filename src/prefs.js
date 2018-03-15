/*

USER PREFERENCES RESOURCES


TO DO

*** - Find a way to make webview windows behave in a modal fashion; currently, 
	if focus isn't placed on a form field, typing on the keyboard can trigger 
	commands in the main app menus; also, it is possible to launch other actions 
	while one is already in progress
*** - Handle situations where user isn't authenticated, and thus cannot sync to 
	db
- sketch-module-web-view doesn't currently support click-and-drag support for 
  the window when the title bar is hidden; this needs to be accounted for when 
  this functionality is eventually available
- Consider whether it's worthwhile supporting storage of preferences in Sketch 
  app user preferences (using NSUserDefaults.standardUserDefaults -> saved to 
  Sketch plist file)
- Determine whether webview dialogs should be further abstracted and moved to 
  ui.js
- Handle instances where user quits before closing dialog, as it fails to save
- Determine which functions need to be exported, and which can stay private
- Determine if/how it'd be possible to store an encrypted auth key locally in 
  Sketch user prefs
- Build in disabling/enabling for parent-dependent subfields
- Build in handling for catastrophic error-handling when parsing config; if file 
	contents somehow get munged, revert to defaults and tell user
- Pull plugin identified from manifest?

NSNonactivatingPanelMask

*/


/* ---- */


/** Get user preferences from config file
	  [!] Performs basic variable checks, but does not validate
	  [!] Will return default settings if no saved settings are found!
    @return {object} — User preferences
*/
export function loadPrefs() {
	
  // If preferences haven't been loaded yet...
  if (objEmpty(curcurUserConfig)) {
		
		// Load configuration file
		let prefsData = readDataFromFile(pluginsDir + CONFIG_FILENAME);
		prefsData = JSON.parse(prefsData);
		
		// If we got a null result from the file load attempt, 
		// populate with default settings and save in new config file 
		if (prefsData === null) {
			
			curUserConfig = DEFAULT_USER_CONFIG;
			writeDataToFile(curcurUserConfig, pluginsDir, CONFIG_FILENAME);
		
		// Otherwise, populate using data from file
		} else {
			
			curcurUserConfig = prefsData;
		}
  }
  
  return curcurUserConfig;
}


/* ---- */


/** Set item in Sketch app preferences
    @param {string} key - Key with which to identify item
    @param {string} value — Value for item
*/
export function setAppPref(key, value) {

	if ((key !== undefined) && (value !== undefined)) {

		try {
		
			// Get user preferences for app
	    let userDefaults = NSUserDefaults.standardUserDefaults();
	    let preferences;
	    
	    // If prefs entry for this plugin doesn't exist, create one
	    if (!userDefaults.dictionaryForKey(PLUGIN_IDENTIFIER)) {
		  
	      preferences = NSMutableDictionary.alloc().init();
	    
	    // Otherwise, pull the entry
	    } else {
		    
	      preferences = NSMutableDictionary.dictionaryWithDictionary(
	      	userDefaults.dictionaryForKey(PLUGIN_IDENTIFIER));
	    }
	    
	    // Set item in prefs entry
	    preferences.setObject_forKey(value, key);
	    userDefaults.setObject_forKey(preferences, PLUGIN_IDENTIFIER);
	    userDefaults.synchronize();
  
		} catch(error) {
			
			console.log(uiStrings.CONSOLE_ERR_PRFX + error);
		}
	
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_SET_APPPREF_NULL);
	}
}


/* ---- */


/** Get item in Sketch app preferences
    @param {string} key - Key with which to identify item
    @return {string} — Value for item
*/
export function getAppPref(key) {

	if (key !== undefined) {

		try {
		
			// Get user preferences for app
	    let userDefaults = NSUserDefaults.standardUserDefaults();
	    let preferences;
	    
	    // If prefs entry for this plugin exists, pull the entry
	    if (userDefaults.dictionaryForKey(PLUGIN_IDENTIFIER)) {

	      preferences = NSMutableDictionary.dictionaryWithDictionary(
	      	userDefaults.dictionaryForKey(PLUGIN_IDENTIFIER));

				return preferences.objectForKey(key);
	    
	    } else {
		    
				console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_APPPREF_NULL);
	    }
  
		} catch(error) {
			
			console.log(uiStrings.CONSOLE_ERR_PRFX + error);
		}
	
	} else {
		
		console.log(uiStrings.CONSOLE_ERR_PRFX + uiStrings.ERR_GET_APPPREF_NULL);
	}
}


/* ---- */


/** Local utility: check if prefs object is empty
*/
function objEmpty( obj ) {
	
	if (obj !== undefined) {

		return ((Object.keys(obj).length === 0) && 
			(obj.constructor === Object));
	}
}
