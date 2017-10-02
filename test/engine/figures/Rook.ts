import { expect } from 'chai';
import Chessboard from '../../../src/engine/Chessboard';
import King from '../../../src/engine/figures/King';
import Rook from '../../../src/engine/figures/Rook';
import { FigureTypes } from '../../../src/engine/utils';

describe( 'Rook', () => {
	describe( 'getAvailableMoves case #1', () => {
		it( 'getAvailableMoves()', () => {
			const whiteRook = new Rook( 0, 0, 0 );
			const cb = Chessboard.fromJSON( [ whiteRook ] );

			const am = whiteRook.getPossibleMoves( cb );

			expect( am.length ).to.equal( 14 );

			for ( const m of am ) {
				expect( m.figure ).to.equal( whiteRook );
				expect( m.type ).to.equal( 'normal' );
			}

			expect( am.map( m => m.dest ) ).to.deep.include( { x: 0, y: 1 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 0, y: 7 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 7, y: 0 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 6, y: 0 } );
			expect( am.map( m => m.dest ) ).to.not.deep.include( { x: 0, y: 0 } );
		} );

		it( 'chessboard getAvailableMoves()', () => {
			const whiteRook = new Rook( 0, 0, 0 );
			const whiteKing = new King( 4, 4, 0 );
			const blackKing = new King( 7, 7, 1 );
			const cb = Chessboard.fromJSON( [ whiteRook, blackKing, whiteKing ] );

			const am = cb.getAvailableMoves();

			expect( am.length ).to.equal( 22 );

			expect( am.map( m => m.dest ) ).to.deep.include( { x: 0, y: 1 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 0, y: 7 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 7, y: 0 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 6, y: 0 } );
			expect( am.map( m => m.dest ) ).to.not.deep.include( { x: 0, y: 0 } );
		} );
	} );

	describe( 'case #2', () => {
		it( 'getAvailableMoves()', () => {
			const whiteRook = new Rook( 3, 3, 0 );
			const whiteKing = new King( 3, 5, 0 );

			const cb = Chessboard.fromJSON( [ whiteRook, whiteKing ] );

			const am = whiteRook.getPossibleMoves( cb );

			expect( am.length ).to.equal( 11 );

			expect( am.map( m => m.dest ) ).to.deep.include( { x: 0, y: 3 } );
			expect( am.map( m => m.dest ) ).to.not.deep.include( { x: 3, y: 5 } );
			expect( am.map( m => m.dest ) ).to.not.deep.include( { x: 3, y: 6 } );
		} );

		it( 'chessboard getAvailableMoves()', () => {
			const whiteRook = new Rook( 3, 3, 0 );
			const whiteKing = new King( 3, 5, 0 );
			const blackKing = new King( 7, 7, 1 );
			const cb = Chessboard.fromJSON( [ whiteRook, blackKing, whiteKing ] );

			const am = cb.getAvailableMoves();

			expect( am.length ).to.equal( 19 );

			expect( am.map( m => m.dest ) ).to.deep.include( { x: 0, y: 3 } );
			expect( am.map( m => m.dest ) ).to.not.deep.include( { x: 3, y: 5 } );
			expect( am.filter( m => m.figure.type === FigureTypes.ROOK ).map( m => m.dest ) ).to.not.deep.include( { x: 3, y: 6 } );
		} );
	} );
} );
