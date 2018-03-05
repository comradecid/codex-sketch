import pluginCall from 'sketch-module-web-view/client'

// Disable the context menu to have a more native feel
document.addEventListener("contextmenu", function( e ) {
  e.preventDefault();
});

document.getElementById('ctrl_close').addEventListener('click', function () {
  pluginCall('dismiss')
})

window.test = function() {
	
}

// called from the plugin
window.setRandomNumber = function (randomNumber) {
  document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
}
