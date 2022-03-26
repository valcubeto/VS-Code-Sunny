const vscode = require('vscode');
const items = require('./completion-items.json');

items.forEach(item => {
	if (Array.isArray(item.documentation)) {
		// like snippet bodys
		item.documentation = item.documentation.join('\n');
	}
	
	// I don't use a template string because there are a lot of escaped characters and it's hard to read
	item.documentation = new vscode.MarkdownString(item.detail + '\n```quara\n' + item.documentation + '\n```');
	
	item.detail = `${item.kind}: '${item.label}'`;
	item.kind = vscode.CompletionItemKind[item.kind];
});

function activate({ subscriptions }) {
	const provider = vscode.languages.registerCompletionItemProvider('quara', { provideCompletionItems: () => items });
	subscriptions.push(provider);
}

module.exports = { activate };