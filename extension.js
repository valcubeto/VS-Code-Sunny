const {
		languages: { registerCompletionItemProvider },
		CompletionItemKind,
		MarkdownString
	} = require('vscode')


const items = require('./completion-items.json')

/**
 * @typedef {typeof items.keywords} CompletionItem
 */

/**
 * @typedef {{ label: string, kind: number, detail: string, documentation: MarkdownString }} VSCompletionItem
 * 'label' is the word to be completed, 'kind' is the icon to be displayed,
 * 'detail' is a title, 'documentation' is a markdown
 */

 /** @type {CompletionItem} */
const completionItems = []

/**
 * If the value is an array returns it joined by a new line
 * @param {string | string[]} value The string or array
 * @returns {string} The string or the joined array
 */
function joinIfArray(value) {
	if (Array.isArray(value))
		return value.join('\n')
	else
		return `${value}`
}

/**
 * @param {CompletionItem} item
 * @param {string} kind
 * @returns {VSCompletionItem}
 */
function createCompletionItem(item, kind) {
	const documentation = []

	if (item.description)
		documentation.push(item.description, '')

	if (item.documentation)
		documentation.push(
			'**Documentation**',
			'```quantum',
			joinIfArray(item.documentation),
			'```'
		)

	if (item.example)
		documentation.push(
		'**Example**',
		'```quantum',
		joinIfArray(item.example),
		'```'
	)

	const completionItem = {
		kind: CompletionItemKind[kind],
		label: item.name,
		detail: `${kind}: ${item.name}`,
		documentation: new MarkdownString(documentation.join('\n'))
	}

	return completionItem
}

const Kinds = {
	'keywords': 'Keyword',
	'types': 'Struct',
	'functions': 'Function'
}

for (const kind in items) {
	items[kind].forEach(item => {
		const completionItem = createCompletionItem(item, Kinds[kind])
		completionItems.push(completionItem)
	})
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