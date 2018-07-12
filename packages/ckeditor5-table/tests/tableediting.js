/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Range from '@ckeditor/ckeditor5-engine/src/model/range';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import VirtualTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/virtualtesteditor';
import { getData as getModelData, setData as setModelData, parse } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import { getCode } from '@ckeditor/ckeditor5-utils/src/keyboard';

import TableEditing from '../src/tableediting';
import { formatTable, formattedModelTable, modelTable } from './_utils/utils';
import InsertRowCommand from '../src/commands/insertrowcommand';
import InsertTableCommand from '../src/commands/inserttablecommand';
import InsertColumnCommand from '../src/commands/insertcolumncommand';
import RemoveRowCommand from '../src/commands/removerowcommand';
import RemoveColumnCommand from '../src/commands/removecolumncommand';
import SplitCellCommand from '../src/commands/splitcellcommand';
import MergeCellCommand from '../src/commands/mergecellcommand';
import SetHeaderRowCommand from '../src/commands/setheaderrowcommand';
import SetHeaderColumnCommand from '../src/commands/setheadercolumncommand';

describe( 'TableEditing', () => {
	let editor, model;

	beforeEach( () => {
		return VirtualTestEditor
			.create( {
				plugins: [ TableEditing, Paragraph ]
			} )
			.then( newEditor => {
				editor = newEditor;

				model = editor.model;
			} );
	} );

	afterEach( () => {
		editor.destroy();
	} );

	it( 'should set proper schema rules', () => {
	} );

	it( 'adds insertTable command', () => {
		expect( editor.commands.get( 'insertTable' ) ).to.be.instanceOf( InsertTableCommand );
	} );

	it( 'adds insertRowAbove command', () => {
		expect( editor.commands.get( 'insertTableRowAbove' ) ).to.be.instanceOf( InsertRowCommand );
	} );

	it( 'adds insertRowBelow command', () => {
		expect( editor.commands.get( 'insertTableRowBelow' ) ).to.be.instanceOf( InsertRowCommand );
	} );

	it( 'adds insertColumnBefore command', () => {
		expect( editor.commands.get( 'insertTableColumnBefore' ) ).to.be.instanceOf( InsertColumnCommand );
	} );

	it( 'adds insertColumnAfter command', () => {
		expect( editor.commands.get( 'insertTableColumnAfter' ) ).to.be.instanceOf( InsertColumnCommand );
	} );

	it( 'adds removeRow command', () => {
		expect( editor.commands.get( 'removeTableRow' ) ).to.be.instanceOf( RemoveRowCommand );
	} );

	it( 'adds removeColumn command', () => {
		expect( editor.commands.get( 'removeTableColumn' ) ).to.be.instanceOf( RemoveColumnCommand );
	} );

	it( 'adds splitCellVertically command', () => {
		expect( editor.commands.get( 'splitTableCellVertically' ) ).to.be.instanceOf( SplitCellCommand );
	} );

	it( 'adds splitCellHorizontally command', () => {
		expect( editor.commands.get( 'splitTableCellHorizontally' ) ).to.be.instanceOf( SplitCellCommand );
	} );

	it( 'adds mergeCellRight command', () => {
		expect( editor.commands.get( 'mergeTableCellRight' ) ).to.be.instanceOf( MergeCellCommand );
	} );

	it( 'adds mergeCellLeft command', () => {
		expect( editor.commands.get( 'mergeTableCellLeft' ) ).to.be.instanceOf( MergeCellCommand );
	} );

	it( 'adds mergeCellDown command', () => {
		expect( editor.commands.get( 'mergeTableCellDown' ) ).to.be.instanceOf( MergeCellCommand );
	} );

	it( 'adds mergeCellUp command', () => {
		expect( editor.commands.get( 'mergeTableCellUp' ) ).to.be.instanceOf( MergeCellCommand );
	} );

	it( 'adds setColumnHeader command', () => {
		expect( editor.commands.get( 'setTableColumnHeader' ) ).to.be.instanceOf( SetHeaderColumnCommand );
	} );

	it( 'adds setRowHeader command', () => {
		expect( editor.commands.get( 'setTableRowHeader' ) ).to.be.instanceOf( SetHeaderRowCommand );
	} );

	describe( 'conversion in data pipeline', () => {
		describe( 'model to view', () => {
			it( 'should create tbody section', () => {
				setModelData( model, '<table><tableRow><tableCell>foo[]</tableCell></tableRow></table>' );

				expect( editor.getData() ).to.equal(
					'<figure class="table">' +
						'<table>' +
							'<tbody>' +
								'<tr><td>foo</td></tr>' +
							'</tbody>' +
						'</table>' +
					'</figure>'
				);
			} );

			it( 'should create thead section', () => {
				setModelData( model, '<table headingRows="1"><tableRow><tableCell>foo[]</tableCell></tableRow></table>' );

				expect( editor.getData() ).to.equal(
					'<figure class="table">' +
						'<table>' +
							'<thead>' +
								'<tr><th>foo</th></tr>' +
							'</thead>' +
						'</table>' +
					'</figure>'
				);
			} );
		} );

		describe( 'view to model', () => {
			it( 'should convert table', () => {
				editor.setData( '<table><tbody><tr><td>foo</td></tr></tbody></table>' );

				expect( getModelData( model, { withoutSelection: true } ) )
					.to.equal( '<table><tableRow><tableCell>foo</tableCell></tableRow></table>' );
			} );
		} );
	} );

	describe( 'caret movement', () => {
		let domEvtDataStub;

		beforeEach( () => {
			domEvtDataStub = {
				keyCode: getCode( 'Tab' ),
				preventDefault: sinon.spy(),
				stopPropagation: sinon.spy()
			};
		} );

		it( 'should do nothing if not tab pressed', () => {
			setModelData( model, modelTable( [
				[ '11', '12[]' ]
			] ) );

			domEvtDataStub.keyCode = getCode( 'a' );

			editor.editing.view.document.fire( 'keydown', domEvtDataStub );

			sinon.assert.notCalled( domEvtDataStub.preventDefault );
			sinon.assert.notCalled( domEvtDataStub.stopPropagation );
			expect( formatTable( getModelData( model ) ) ).to.equal( formattedModelTable( [
				[ '11', '12[]' ]
			] ) );
		} );

		it( 'should do nothing if Ctrl+Tab is pressed', () => {
			setModelData( model, modelTable( [
				[ '11', '12[]' ]
			] ) );

			domEvtDataStub.ctrlKey = true;

			editor.editing.view.document.fire( 'keydown', domEvtDataStub );

			sinon.assert.notCalled( domEvtDataStub.preventDefault );
			sinon.assert.notCalled( domEvtDataStub.stopPropagation );
			expect( formatTable( getModelData( model ) ) ).to.equal( formattedModelTable( [
				[ '11', '12[]' ]
			] ) );
		} );

		describe( 'on TAB', () => {
			it( 'should do nothing if selection is not in a table', () => {
				setModelData( model, '[]' + modelTable( [
					[ '11', '12' ]
				] ) );

				editor.editing.view.document.fire( 'keydown', domEvtDataStub );

				sinon.assert.notCalled( domEvtDataStub.preventDefault );
				sinon.assert.notCalled( domEvtDataStub.stopPropagation );
				expect( formatTable( getModelData( model ) ) ).to.equal( '[]' + formattedModelTable( [
					[ '11', '12' ]
				] ) );
			} );

			it( 'should move to next cell', () => {
				setModelData( model, modelTable( [
					[ '11[]', '12' ]
				] ) );

				editor.editing.view.document.fire( 'keydown', domEvtDataStub );

				sinon.assert.calledOnce( domEvtDataStub.preventDefault );
				sinon.assert.calledOnce( domEvtDataStub.stopPropagation );
				expect( formatTable( getModelData( model ) ) ).to.equal( formattedModelTable( [
					[ '11', '[12]' ]
				] ) );
			} );

			it( 'should create another row and move to first cell in new row', () => {
				setModelData( model, modelTable( [
					[ '11', '[12]' ]
				] ) );

				editor.editing.view.document.fire( 'keydown', domEvtDataStub );

				expect( formatTable( getModelData( model ) ) ).to.equal( formattedModelTable( [
					[ '11', '12' ],
					[ '[]', '' ]
				] ) );
			} );

			it( 'should move to the first cell of next row if on end of a row', () => {
				setModelData( model, modelTable( [
					[ '11', '12[]' ],
					[ '21', '22' ]
				] ) );

				editor.editing.view.document.fire( 'keydown', domEvtDataStub );

				expect( formatTable( getModelData( model ) ) ).to.equal( formattedModelTable( [
					[ '11', '12' ],
					[ '[21]', '22' ]
				] ) );
			} );

			describe( 'on table widget selected', () => {
				beforeEach( () => {
					editor.model.schema.register( 'block', {
						allowWhere: '$block',
						allowContentOf: '$block',
						isObject: true
					} );

					editor.conversion.elementToElement( { model: 'block', view: 'block' } );
				} );

				it( 'should move caret to the first table cell on TAB', () => {
					const spy = sinon.spy();

					editor.editing.view.document.on( 'keydown', spy );

					setModelData( model, '[' + modelTable( [
						[ '11', '12' ]
					] ) + ']' );

					editor.editing.view.document.fire( 'keydown', domEvtDataStub );

					sinon.assert.calledOnce( domEvtDataStub.preventDefault );
					sinon.assert.calledOnce( domEvtDataStub.stopPropagation );

					expect( formatTable( getModelData( model ) ) ).to.equal( formattedModelTable( [
						[ '[11]', '12' ]
					] ) );

					// Should cancel event - so no other tab handler is called.
					sinon.assert.notCalled( spy );
				} );

				it( 'shouldn\'t do anything on other blocks', () => {
					const spy = sinon.spy();

					editor.editing.view.document.on( 'keydown', spy );

					setModelData( model, '[<block>foo</block>]' );

					editor.editing.view.document.fire( 'keydown', domEvtDataStub );

					sinon.assert.notCalled( domEvtDataStub.preventDefault );
					sinon.assert.notCalled( domEvtDataStub.stopPropagation );

					expect( formatTable( getModelData( model ) ) ).to.equal( '[<block>foo</block>]' );

					// Should not cancel event.
					sinon.assert.calledOnce( spy );
				} );
			} );
		} );

		describe( 'on SHIFT+TAB', () => {
			beforeEach( () => {
				domEvtDataStub.shiftKey = true;
			} );

			it( 'should do nothing if selection is not in a table', () => {
				setModelData( model, '[]' + modelTable( [
					[ '11', '12' ]
				] ) );

				domEvtDataStub.keyCode = getCode( 'Tab' );
				domEvtDataStub.shiftKey = true;

				editor.editing.view.document.fire( 'keydown', domEvtDataStub );

				sinon.assert.notCalled( domEvtDataStub.preventDefault );
				sinon.assert.notCalled( domEvtDataStub.stopPropagation );
				expect( formatTable( getModelData( model ) ) ).to.equal( '[]' + formattedModelTable( [
					[ '11', '12' ]
				] ) );
			} );

			it( 'should move to previous cell', () => {
				setModelData( model, modelTable( [
					[ '11', '12[]' ]
				] ) );

				editor.editing.view.document.fire( 'keydown', domEvtDataStub );

				sinon.assert.calledOnce( domEvtDataStub.preventDefault );
				sinon.assert.calledOnce( domEvtDataStub.stopPropagation );
				expect( formatTable( getModelData( model ) ) ).to.equal( formattedModelTable( [
					[ '[11]', '12' ]
				] ) );
			} );

			it( 'should not move if caret is in first table cell', () => {
				setModelData( model, '<paragraph>foo</paragraph>' + modelTable( [
					[ '[]11', '12' ]
				] ) );

				editor.editing.view.document.fire( 'keydown', domEvtDataStub );

				expect( formatTable( getModelData( model ) ) ).to.equal(
					'<paragraph>foo</paragraph>' + formattedModelTable( [ [ '[]11', '12' ] ] )
				);
			} );

			it( 'should move to the last cell of previous row if on beginning of a row', () => {
				setModelData( model, modelTable( [
					[ '11', '12' ],
					[ '[]21', '22' ]
				] ) );

				editor.editing.view.document.fire( 'keydown', domEvtDataStub );

				expect( formatTable( getModelData( model ) ) ).to.equal( formattedModelTable( [
					[ '11', '[12]' ],
					[ '21', '22' ]
				] ) );
			} );
		} );
	} );

	describe( 'post-fixer', () => {
		let root;

		beforeEach( () => {
			root = model.document.getRoot();
		} );

		it( 'should add missing columns to a tableRows that are shorter then longest table row', () => {
			const parsed = parse( modelTable( [
				[ '00' ],
				[ '10', '11', '12' ],
				[ '20', '21' ]
			] ), model.schema );

			model.change( writer => {
				writer.remove( Range.createIn( root ) );
				writer.insert( parsed, root );
			} );

			expect( formatTable( getModelData( model, { withoutSelection: true } ) ) ).to.equal( formattedModelTable( [
				[ '00', '', '' ],
				[ '10', '11', '12' ],
				[ '20', '21', '' ]
			] ) );
		} );

		it( 'should add missing columns to a tableRows that are shorter then longest table row (complex)', () => {
			const parsed = parse( modelTable( [
				[ { colspan: 6, contents: '00' } ],
				[ { rowspan: 2, contents: '10' }, '11', { colspan: 3, contents: '12' } ],
				[ '21', '22' ]
			] ), model.schema );

			model.change( writer => {
				writer.remove( Range.createIn( root ) );
				writer.insert( parsed, root );
			} );

			expect( formatTable( getModelData( model, { withoutSelection: true } ) ) ).to.equal( formattedModelTable( [
				[ { colspan: 6, contents: '00' } ],
				[ { rowspan: 2, contents: '10' }, '11', { colspan: 3, contents: '12' }, '' ],
				[ '21', '22', '', '', '' ]
			] ) );
		} );

		// Client A: insert row. Client B: insert column.
		it( 'should fix missing insert column before insert row', () => {
			setModelData( model, modelTable( [
				[ '00[]', '01', '02' ],
				[ '10', '11', '12' ],
				[ '20', '21', '22' ]
			] ) );

			const table = root.getChild( 0 );

			// Insert column:
			model.change( writer => {
				for ( const tableRow of table.getChildren() ) {
					const tableCell = writer.createElement( 'tableCell' );
					writer.insert( tableCell, tableRow, 1 );
					writer.insertText( 'x', tableCell );
				}
			} );

			// Insert table row
			model.change( writer => {
				const parsedTable = parse(
					modelTable( [ [ 'a', 'b', 'c' ] ] ),
					model.schema
				);

				writer.insert( parsedTable.getChild( 0 ), table, 2 );
			} );

			expect( formatTable( getModelData( model, { withoutSelection: true } ) ) ).to.equal( formattedModelTable( [
				[ '00', 'x', '01', '02' ],
				[ '10', 'x', '11', '12' ],
				[ 'a', 'b', 'c', '' ],
				[ '20', 'x', '21', '22' ]
			] ) );
		} );

		// Client A: insert row. Client B: insert column.
		it( 'should fix (undo of add tableRow & add tableCell)', () => {
			setModelData( model, modelTable( [
				[ '00', 'x', '01', '02' ],
				[ '10', 'x', '11', '12' ],
				[ 'a', 'b', 'c', '' ],
				[ '20', 'x', '21', '22' ]
			] ) );

			const table = root.getChild( 0 );

			// Insert column:
			model.change( writer => {
				[ 0, 1, 3 ].map( index => writer.remove( table.getChild( index ).getChild( 1 ) ) );
			} );

			expect( formatTable( getModelData( model, { withoutSelection: true } ) ) ).to.equal( formattedModelTable( [
				[ '00', '01', '02' ],
				[ '10', '11', '12' ],
				[ 'a', 'b', 'c' ],
				[ '20', '21', '22' ]
			] ) );
		} );

		// Client A: insert row. Client B: insert column.
		it( 'should fix (undo of add tableRow & add tableCell) fff', () => {
			setModelData( model, modelTable( [
				[ '00', 'x', '01', '02' ],
				[ '10', 'x', '11', '12' ],
				[ 'a', { colspan: 3, contents: 'b' } ],
				[ '20', 'x', '21', '22' ]
			] ) );

			const table = root.getChild( 0 );

			// Insert column:
			model.change( writer => {
				[ 0, 1, 3 ].map( index => writer.remove( table.getChild( index ).getChild( 1 ) ) );
			} );

			expect( formatTable( getModelData( model, { withoutSelection: true } ) ) ).to.equal( formattedModelTable( [
				[ '00', '01', '02' ],
				[ '10', '11', '12' ],
				[ 'a', { colspan: 2, contents: 'b' } ],
				[ '20', '21', '22' ]
			] ) );
		} );

		// Client A: insert row. Client B: insert column.
		it( 'should not fix (undo of add tableRow & add tableCell) - OK', () => {
			setModelData( model, modelTable( [
				[ '00', 'x', '01', '02' ],
				[ '10', 'x', '11', '12' ],
				[ 'a', 'b', 'c', '' ],
				[ '20', 'x', '21', '22' ]
			] ) );

			const table = root.getChild( 0 );

			// Insert column:
			model.change( writer => {
				[ 0, 1, 3 ].map( index => writer.remove( table.getChild( index ).getChild( 1 ) ) );

				// Remove one more cell... (shouldn't occur??)
				writer.remove( table.getChild( 0 ).getChild( 1 ) );
			} );

			expect( formatTable( getModelData( model, { withoutSelection: true } ) ) ).to.equal( formattedModelTable( [
				[ '00', '02' ],
				[ '10', '11', '12' ],
				[ 'a', 'b', 'c', '' ],
				[ '20', '21', '22' ]
			] ) );
		} );
	} );
} );
