/*

FRAME DELEGATION

More info: https://developer.apple.com/reference/webkit/webframeloaddelegate?language=objc

*/
import WebUI from 'sketch-module-web-view'


export default function(context) {
  const webUI = new WebUI(context, require('../resources/dlog_prefs.html'), {
    identifier: 'codex.prefs', // Unique ID for referring to this dialog
    x: 0,
    y: 0,
	  width: 640,
	  height: 480,
    blurredBackground: true,
    onlyShowCloseButton: true,
		title: 'Preferences',
    hideTitleBar: false,
    shouldKeepAround: true,
		resizable: false, 
    frameLoadDelegate: {
      'webView:didFinishLoadForFrame:'(webView, webFrame) {
        context.document.showMessage('UI loaded!')
      }
    },
    handlers: {

      dismiss() {
        context.document.showMessage('closing')

        //webUI.eval(`setRandomNumber(${Math.random()})`)
        webUI.panel.close();
      }

    }
  })
}
