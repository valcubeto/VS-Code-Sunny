const {
		window: { showInformationMessage },
		languages: { registerCompletionItemProvider },
		CompletionItemKind,
		MarkdownString
	} = require('vscode')


const items = require('./completion-items.json')

/**
 * @typedef {{ label: string, kind: number, detail: string, documentation: string }} CompletionItem
 * 'label' is the word to be completed, 'kind' is the icon to be displayed,
 * 'detail' is a comment above the documentation, 'documentation' here is an example
 */

 /** @type {CompletionItem[]} */
const completionItems = []

/**
 * Uppercases the first letter of each word
 * @param {string} string The string to be capitalized
 * @returns {string} The capitalized string
 */
function capitalize(string) {
	return string.replace(/(?<!\w)\w(?=\w)/g, firstLetter => firstLetter.toUpperCase())
}

for (const item of items) {
	const compItem = {}

	compItem.label = item.name
	compItem.kind = CompletionItemKind[capitalize(item.is)]
	compItem.detail = `${capitalize(item.is)}: ${item.name}`

	const documentation = [
		item.description,
		'',
		'**Example**:',
		'```quantum',
		Array.isArray(item.documentation)
			? item.documentation.join('\n')
			: item.documentation,
		'```'
	].join('\n')
	compItem.documentation = new MarkdownString(documentation)

	completionItems.push(compItem)
}

function activate({ subscriptions }) {
	const provider = registerCompletionItemProvider('quantum', {
		provideCompletionItems() {
			return completionItems
		}
	})
	subscriptions.push(provider)
}

module.exports = { activate }