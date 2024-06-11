const vscode = require('vscode')


function loadCompletionItems() {
	let items;
	try {
		items = require('./completion-items.json_');
	} catch (error) {
		vscode.window.showErrorMessage("Failed to load the completion items file", ["what", "the"]);
		return;
	}

	/** @type {vscode.CompletionList} */
	const completionItems = [];

	/**
	 * If the value is an array returns it joined by a new line
	 * @param {string | string[]} value The string or array
	 * @returns {string} The string or the joined array
	 */
	function joinIfArray(value) {
		return Array.isArray(value) ? value.join('\n') : `${value}`
	}

	const KindMap = {
		'keywords': 'Keyword',
		'types': 'Struct',
		'functions': 'Function'
	}

	/** @typedef {{ name: string, description: string, documentation: string | string[] }} CompletionItem */
	/**
	 * @param {CompletionItem} item
	 * @param {string} kind
	 * @returns {vscode.CompletionItem}
	 */
	function createCompletionItem(item, kind) {
		const documentation = []

		if (item.description) {
			documentation.push(item.description, '')
		}

		if (item.documentation) {
			documentation.push(
				'**Documentation**',
				'```sny',
				joinIfArray(item.documentation),
				'```'
			)
		}

		if (item.example) {
			documentation.push(
				'```sunny',
				joinIfArray(item.example),
				'```'
			)
		}

		const completionItem = {
			kind: vscode.CompletionItemKind[KindMap[kind]],
			label: item.name,
			detail: `${kind.slice(0, -1)}: ${item.name}`,
			documentation: new vscode.MarkdownString(documentation.join('\n'))
		}

		return completionItem
	}

		for (const kind in items) {
			items[kind].forEach(item => {
				const completionItem = createCompletionItem(item, kind)
				completionItems.push(completionItem)
			})
		}

		function activate({ subscriptions }) {
			const completionItemProvider = vscode.languages.registerCompletionItemProvider('sunny', {
				/**
				 * @param {vscode.TextDocument} document
				 * @param {vscode.TextDocument} document 
				 * @param {vscode.Position} position 
				 * @param {vscode.CancellationToken} token
				 * @param {vscode.CompletionContext} context 
				 * @returns {vscode.CompletionList}
				 */
				provideCompletionItems(document, position, token, context) {
					if (document.languageId !== LANG_ID) return;
					// TODO: provide more items based on the current context
					return completionItems
				}
			});
			const hoverProvider = vscode.languages.registerHoverProvider('sunny', {
				/**
				 * 
				 * @param {vscode.TextDocument} document 
				 * @param {vscode.Position} position
				 * @param {vscode.CancellationToken} token
				 * @returns {vscode.ProviderResult<vscode.Hover>}
				 */
				provideHover(document, position, _token) {
					if (document.isUntitled) return;
					vscode.window.showInformationMessage(`Hovering over ${document.fileName}`);
					return new vscode.Hover("This is a test", new vscode.Range(position, position.translate(1)));
				}
			});

			subscriptions.push(
				completionItemProvider,
				hoverProvider
			);
		}

		module.exports = { activate };

		// export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;
}

loadCompletionItems();
