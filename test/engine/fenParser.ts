import { expect } from 'chai';
import { stringify } from "../../src/engine/fenParser";
import { createChessBoardAtInitialPosition, createChessBoardFromJSON } from '../../src/engine/board-utils';

describe( 'fenParser', () => {
	describe( 'stringify()', () => {
		it( 'should stringify initial position', () => {
			const cb = createChessBoardAtInitialPosition();

			const id = stringify( cb );

			expect( id ).to.equal( 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w' );
		} );

		it( 'should stringify the empty board', () => {
			const cb = createChessBoardFromJSON( [] );

			const id = stringify( cb );

			expect( id ).to.equal( '8/8/8/8/8/8/8/8 w' );
		} );

		it( 'should stringify the board after the first move', () => {
			const cb = createChessBoardFromJSON( [] );


			const id = stringify( cb );

			expect( id ).to.equal( '8/8/8/8/8/8/8/8 w' );
		} );
	} );
} );
