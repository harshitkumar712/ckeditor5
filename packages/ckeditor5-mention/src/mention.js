/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module mention/mention
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import MentionEditing from './mentionediting';
import MentionUI from './mentionui';

import '../theme/mention.css';

/**
 * The mention plugin.
 *
 * For a detailed overview, check the {@glink features/mention Mention feature documentation}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Mention extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Mention';
	}

	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ MentionEditing, MentionUI ];
	}
}

/**
 * The configuration of the {@link module:mention/mention~Mention} feature.
 *
 * Read more in {@link module:mention/mention~MentionConfig}.
 *
 * @member {module:mention/mention~MentionConfig} module:core/editor/editorconfig~EditorConfig#mention
 * @type {Array.<module/mention~MentionFeed>}
 */

/**
 * The configuration of the mention feature.
 *
 * Read more about {@glink features/mention#configuration configuring the mention feature}.
 *
 *		ClassicEditor
 *			.create( editorElement, {
 *				mention: ... // Media embed feature options.
 *			} )
 *			.then( ... )
 *			.catch( ... );
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 *
 * @interface MentionConfig
 */

/**
 * The list of mention feeds supported by the editor.
 *
 *		ClassicEditor
 *			.create( editorElement, {
 *				plugins: [ Mention, ... ],
 *				mention: {
 *					feeds: [
 *						{
 *							marker: '@',
 *							feed: [ 'Barney', 'Lily', 'Marshall', 'Robin', 'Ted' ]
 *						},
 *						...
 * 					]
 *				}
 *			} )
 *			.then( ... )
 *			.catch( ... );
 *
 * You can provide as many mention feeds but they must use different `marker`s.
 * For example, you can use `'@'` to autocomplete people and `'#'` to autocomplete tags.
 *
 * @member {Array.<module:mention/mention~MentionFeed>} module:mention/mention~MentionConfig#feeds
 */

/**
 * The mention feed descriptor. Used in {@link module:mention/mention~MentionConfig `config.mention`}.
 *
 * See {@link module:mention/mention~MentionConfig} to learn more.
 *
 *		// Static configuration.
 *		const mentionFeedPeople = {
 *			marker: '@',
 *			feed: [ 'Alice', 'Bob', ... ],
 *			minimumCharacters: 2
 *		};
 *
 *		// Simple, synchronous callback.
 *		const mentionFeedTags = {
 *			marker: '#',
 *			feed: searchString => {
 *				return tags
 *					// Filter the tags list.
 *					.filter( tag => {
 *						return tag.toLowerCase() == queryText.toLowerCase();
 *					} )
 *					// Return 10 items max - needed for generic queries when the list may contain hundreds of elements.
 *					.slice( 0, 10 );
 *			}
 * 		};
 *
 *		const tags = [ 'wysiwyg', 'rte', 'rich-text-edior', 'collaboration', 'real-time', ... ];
 *
 *		// Asynchronous callback.
 *		const mentionFeedPlaceholders = {
 *			marker: '$',
 *			feed: searchString => {
 *				return getMatchingPlaceholders( searchString );
 *			}
 * 		};
 *
 *		function getMatchingPlaceholders( searchString ) {
 *			return new Promise( resolve => {
 *				doSomeXHRQuery( result => {
 *					// console.log( result );
 *					// -> [ '$name', '$surname', '$postal', ... ]
 *
 *					resolve( result );
 * 				} );
 *			} );
 *		}
 *
 * @typedef {Object} module:mention/mention~MentionFeed
 * @property {String} [marker='@'] The character which triggers autocompletion for mention.
 * @property {Array.<module:mention/mention~MentionFeedItem>|Function} feed The autocomplete items. Provide an array for
 * a static configuration (the mention feature will show matching items automatically) or a function which returns an array of
 * matching items (directly, or via a promise).
 * @property {Number} [minimumCharacters=0] Specifies after how many characters the autocomplete panel should be shown.
 * @property {Function} [itemRenderer] Function that renders a {@link module:mention/mention~MentionFeedItem}
 * to the autocomplete panel.
 */

/**
 * The mention feed item. It may be defined as a string or a plain object.
 *
 * When defining feed item as a plain object, the `name` property is obligatory. The additional properties
 * can be used when customizing the mention feature bahaviour
 * (see {@glink features/mention#customizing-the-autocomplete-list "Customizing the autocomplete list"}
 * and {@glink features/mention#customizing-the-output "Customizing the output"} sections).
 *
 *		ClassicEditor
 *			.create( editorElement, {
 *				plugins: [ Mention, ... ],
 *				mention: {
 *					feeds: [
 *						// Feed items as objects.
 *						{
 *							marker: '@',
 *							feed: [
 *								{
 *									name: 'Barney',
 *									fullName: 'Barney Bloom'
 *								},
 *								{
 *									name: 'Lily',
 *									fullName: 'Lily Smith'
 *								},
 *								{
 *									name: 'Marshall',
 *									fullName: 'Marshall McDonald'
 *								},
 *								{
 *									name: 'Robin',
 *									fullName: 'Robin Hood'
 *								},
 *								{
 *									name: 'Ted',
 *									fullName: 'Ted Cruze'
 *								},
 *								// ...
 *							]
 *						},
 *
 *						// Feed items as plain strings.
 *						{
 *							marker: '#',
 *							feed: [ 'wysiwyg', 'rte', 'rich-text-edior', 'collaboration', 'real-time', ... ]
 *						},
 * 					]
 *				}
 *			} )
 *			.then( ... )
 *			.catch( ... );
 *
 * @typedef {Object|String} module:mention/mention~MentionFeedItem
 * @property {String} name Name of the mention.
 */
