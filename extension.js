const vscode = require('vscode');
const items = require('./completion-items.json');

items.forEach(item => {
	if (Array.isArray(item.documentation)) {
		// like snippet bodys
		item.documentation = item.documentation.join('\n');
	}

	item.detail
		? item.detail += '\n'
		: item.detail = '';

	item.documentation = new vscode.MarkdownString(item.detail + '```quara\n' + item.documentation + '\n```');

	item.detail = `(${item.kind.toLowerCase()}) ${item.label}`;
	item.kind = vscode.CompletionItemKind[item.kind];
});

function activate({ subscriptions }) {
	const provider = vscode.languages.registerCompletionItemProvider('quara', { provideCompletionItems: () => items });
	subscriptions.push(provider);
}

module.exports = { activate };