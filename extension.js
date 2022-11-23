const {
		window: { showInformationMessage },
		languages: { registerCompletionItemProvider },
		CompletionItemKind,
		MarkdownString
	} = require('vscode')


const items = require('./completion-items.json')

const finalItems = []

/**
 * Uppercases the first letter of each word
 * @param {string} string The string to be capitalized
 * @returns {string} The capitalized string
 */
function capitalize(string) {
	return string.replace(/(?<!\w)\w(?=\w)/g, firstLetter => firstLetter.toUpperCase())
}

for (const item of items) {
	const finalItem = {}

	finalItem.label = item.name
	finalItem.kind = CompletionItemKind[capitalize(item.is)]
	finalItem.detail = `${capitalize(item.is)}: ${item.name}`

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
	finalItem.documentation = new MarkdownString(documentation)

	finalItems.push(finalItem)
}

function activate({ subscriptions }) {
	const provider = registerCompletionItemProvider('quantum', {
		provideCompletionItems() {
			return finalItems
		}
	})
	subscriptions.push(provider)
}

module.exports = { activate }