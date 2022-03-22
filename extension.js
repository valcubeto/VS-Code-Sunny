const vscode = require('vscode');
const items = require('./completion-items.json');
items.forEach(item => {
	item.documentation = new vscode.MarkdownString('```quara\n$\n```'.replace('$', item.documentation));
});

function activate({ subscriptions }) {
	const provider = vscode.languages.registerCompletionItemProvider('quara', { provideCompletionItems: () => items }, '.');
	subscriptions.push(provider);
}

module.exports = { activate };