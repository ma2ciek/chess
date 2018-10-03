import { expect } from 'chai';
import { Chessboard } from "../../src/engine/Engine";
import { stringify } from "../../src/engine/fenParser";

describe( 'fenParser', () => {
	describe( 'stringify()', () => {
		it( 'should stringify initial position', () => {
			const cb = Chessboard.createInitialPosition();

			const id = stringify( cb );

			expect( id ).to.equal( 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w' );
		} );

		it( 'should stringify the empty board', () => {
			const cb = Chessboard.fromJSON( [] );

			const id = stringify( cb );

			expect( id ).to.equal( '8/8/8/8/8/8/8/8 w' );
		} );

		it( 'should stringify the board after the first move', () => {
			const cb = Chessboard.fromJSON( [] );


			const id = stringify( cb );

			expect( id ).to.equal( '8/8/8/8/8/8/8/8 w' );
		} );
	} );
} );
