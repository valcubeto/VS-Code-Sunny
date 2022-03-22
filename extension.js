const vscode = require('vscode');

/** @param {Array} {subscriptions} */
function activate({ subscriptions }) {
	vscode.window.showInformationMessage('Quara extension activated');

	const provider = vscode.languages.registerCompletionItemProvider('quara', {
		provideCompletionItems: () => require('./completion-items.json')
	}, '.');

	subscriptions.push(provider);
}	
	
module.exports = { activate };