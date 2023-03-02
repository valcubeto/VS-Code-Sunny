const vscode = require('vscode')

try {
	const items = require('./completion-items.json')

	/** 
	 * @typedef {{  }} CompletionItem
	 * @typedef {typeof vscode.CompletionItem} VSCCompletionItem
	 */

	/** @type {CompletionItem} */
	const completionItems = []

	/**
	 * If the value is an array returns it joined by a new line
	 * @param {string | string[]} value The string or array
	 * @returns {string} The string or the joined array
	 */
	function joinIfArray(value) {
		if (Array.isArray(value)) {
			return value.join('\n')
		} else {
			return `${value}`
		}
	}

	const KindMap = {
		'keywords': 'Keyword',
		'types': 'Struct',
		'functions': 'Function'
	}

	/**
	 * @param {CompletionItem} item
	 * @param {string} kind
	 * @returns {VSCCompletionItem}
	 */
	function createCompletionItem(item, kind) {
		const documentation = []

		if (item.description) {
			documentation.push(item.description, '')
		}

		if (item.documentation) {
			documentation.push(
				'**Documentation**',
				'```sunny',
				joinIfArray(item.documentation),
				'```'
			)
		}

		if (item.example) {
			documentation.push(
				'**Example**',
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
			provideCompletionItems(document, position, token, context) {
				return completionItems
			}
		})
		const hoverProvider = vscode.languages.registerHoverProvider('sunny', {
			provideHover(document, position, token, next) {
				if (document.isUntitled) return 
				// const sunny = cp.spawn('bin/sunny-analizer', [`--line=${position.line}`, `--char=${position.character}`, document.uri.fsPath])
				/*
				*/
				// vscode.window.showInformationMessage(JSON.stringify({ document, position, token, next }, null, 2))
				/*
				{
					"document": {
						"uri": {
							"$mid": 1,
							"fsPath": "c:\\Users\\valen\\OneDrive\\Escritorio\\finally-qmark\\docs.qua",
							"_sep": 1,
							"external": "file:///c%3A/Users/valen/OneDrive/Escritorio/finally-qmark/docs.qua",
							"path": "/C:/Users/valen/OneDrive/Escritorio/finally-qmark/docs.qua",
							"scheme": "file"
						},
						"fileName": "c:\\Users\\valen\\OneDrive\\Escritorio\\finally-qmark\\docs.qua",
						"isUntitled": false,
						"languageId": "sunny",
						"version": 1,
						"isClosed": false,
						"isDirty": false,
						"eol": 1,
						"lineCount": 103
					},
					"position": {
						"line": 72,
						"character": 62
					},
					"token": {
						"a": false,
						"b": null
					}
				}
				*/
				return [
					{
						name: 'void',
						documentation: 'type void'
					}
				]
			}
		})

		subscriptions.push(
			completionItemProvider,
			hoverProvider
		)
	}

	module.exports = { activate }

	// export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;
} catch (error) {
	vscode.window.showErrorMessage(error.toString())
}