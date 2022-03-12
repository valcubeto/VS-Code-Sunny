const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	vscode.window.showInformationMessage('Extension activated');
	vscode.languages.registerHoverProvider('quara', {
		provideHover(document, { line, character }, token) {
			return { contents: [`Token: '${token}' at ${line}:${character}`, '??'] };
		}
	});
}

module.exports = { activate };