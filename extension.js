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
			provideCompletionItems(_document, _position, _token, _context) {
				return completionItems
			}
		})
		const hoverProvider = vscode.languages.registerHoverProvider('sunny', {
			provideHover(document, _position, _token, _next) {
				// if (document.isUntitled) return
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