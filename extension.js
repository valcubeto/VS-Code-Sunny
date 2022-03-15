const vscode = require('vscode');

/** @param {vscode.ExtensionContext} context */
function activate(context) {
	vscode.window.showInformationMessage('Quara extension activated');
}	
	
module.exports = { activate };


/*
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			'quara',
			new vscode.CompletionItemProvider().provideCompletionItems(
				new vscode.TextDocument(),
				new vscode.Position(),
				new vscode.CancellationToken(),
				new vscode.CompletionContext()
			),
			'.'
		)
	);
*/

// when intentas hacer que funcione el autocompletado y el hover funcionen pero no funcionan ni los de javascript XDdXDXXDx

/*
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(0, new class extends  {
			provideCompletionItems(document, position, tokens) {
				vscode.window.showInformationMessage(`Completion at ${position.line + 1}:${position.character + 1}`);
			}
		}, '.')
	);
	vscode.languages.registerHoverProvider('quara', {
		provideHover(document, position, token) {
			return {
				contents: [`Hover at ${position.line + 1}:${position.character + 1}`]
			};
		}
	});
*/

vscode.workspace.createFileSystemWatcher

// https://thatpervert.com/tag/kamuo