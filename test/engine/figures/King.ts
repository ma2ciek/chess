import { expect } from 'chai';
import Chessboard from '../../../src/engine/Chessboard';
import King from '../../../src/engine/figures/King';
import Rook from '../../../src/engine/figures/Rook';
import { Color, MoveTypes } from '../../../src/engine/utils';

describe( 'King', () => {
	describe( 'case #1', () => {
		it( 'getAvailableMoves()', () => {
			const whiteKing = new King( 3, 5, Color.White );

			const cb = Chessboard.fromJSON( [ whiteKing ] );

			const am = whiteKing.getPossibleMoves( cb );

			expect( am.length ).to.equal( 8 );

			expect( am.map( m => m.dest ) ).to.deep.include( { x: 2, y: 4 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 2, y: 5 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 2, y: 6 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 3, y: 4 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 3, y: 6 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 4, y: 4 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 4, y: 5 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 4, y: 6 } );
		} );

		it( 'chessboard getAvailableMoves()', () => {
			const whiteKing = new King( 3, 5, Color.White );
			const blackKing = new King( 7, 7, Color.Black );
			const cb = Chessboard.fromJSON( [ blackKing, whiteKing ] );

			const am = cb.getAvailableMoves();

			expect( am.length ).to.equal( 8 );

			expect( am.map( m => m.dest ) ).to.deep.include( { x: 2, y: 4 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 2, y: 5 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 2, y: 6 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 3, y: 4 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 3, y: 6 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 4, y: 4 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 4, y: 5 } );
			expect( am.map( m => m.dest ) ).to.deep.include( { x: 4, y: 6 } );
		} );
	} );

	describe( 'castles', () => {
		it( 'Castle QueenSide #1', () => {
			const whiteKing = new King( 4, 0, Color.White );
			const whiteRook = new Rook( 0, 0, Color.White );

			const cb = Chessboard.fromJSON( [ whiteKing, whiteRook ] );

			const am = whiteKing.getPossibleMoves( cb );
			const cam = cb.getAvailableMoves();

			expect( am.length ).to.equal( 6 );
			expect( cam.length ).to.equal( 16 );

			expect( am ).to.deep.include( {
				figure: whiteKing,
				type: MoveTypes.CASTLE_QUEENSIDE,
				dest: { x: 2, y: 0 },
			} );
		} );

		it( 'Castle KingSide #1', () => {
			const whiteKing = new King( 4, 0, Color.White );
			const whiteRook = new Rook( 7, 0, Color.White );

			const cb = Chessboard.fromJSON( [ whiteKing, whiteRook ] );

			const am = whiteKing.getPossibleMoves( cb );
			const cam = cb.getAvailableMoves();

			expect( am.length ).to.equal( 6 );
			expect( cam.length ).to.equal( 15 );

			expect( am ).to.deep.include( {
				figure: whiteKing,
				type: MoveTypes.CASTLE_KINGSIDE,
				dest: { x: 6, y: 0 },
			} );
		} );

		it( 'Both castles should be available', () => {
			const whiteKing = new King( 4, 0, Color.White );
			const whiteRook1 = new Rook( 0, 0, Color.White );
			const whiteRook2 = new Rook( 7, 0, Color.White );

			const cb = Chessboard.fromJSON( [ whiteKing, whiteRook1, whiteRook2 ] );

			const am = whiteKing.getPossibleMoves( cb );
			const cam = cb.getAvailableMoves();

			expect( am.length ).to.equal( 7 );
			expect( cam.length ).to.equal( 26 );

			expect( am ).to.deep.include( {
				figure: whiteKing,
				type: MoveTypes.CASTLE_KINGSIDE,
				dest: { x: 6, y: 0 },
			} );

			expect( am ).to.deep.include( {
				figure: whiteKing,
				type: MoveTypes.CASTLE_QUEENSIDE,
				dest: { x: 2, y: 0 },
			} );
		} );

		it( 'Castle QueenSide should not be able when king is being checked', () => {
			const whiteKing = new King( 4, 0, Color.White );
			const blackKing = new King( 7, 7, Color.Black );
			const whiteRook = new Rook( 0, 0, Color.White );
			const blackRook = new Rook( 4, 7, Color.Black );

			const cb = Chessboard.fromJSON( [ whiteKing, whiteRook, blackKing, blackRook ] );

			const am = whiteKing.getPossibleMoves( cb );
			const cam = cb.getAvailableMoves();

			expect( am.length ).to.equal( 5 );
			expect( cam.length ).to.equal( 4 );

			expect( am ).to.not.deep.include( {
				figure: whiteKing,
				type: MoveTypes.CASTLE_QUEENSIDE,
				dest: { x: 2, y: 0 },
			} );
		} );

		it( 'Castle QueenSide should not be able when one field of the king path is being checked', () => {
			const whiteKing = new King( 4, 0, Color.White );
			const blackKing = new King( 7, 7, Color.Black );
			const whiteRook = new Rook( 0, 0, Color.White );
			const blackRook = new Rook( 3, 7, Color.Black );

			const cb = Chessboard.fromJSON( [ whiteKing, whiteRook, blackKing, blackRook ] );

			const am = whiteKing.getPossibleMoves( cb );
			const cam = cb.getAvailableMoves();

			expect( am.length ).to.equal( 5 );
			expect( cam.length ).to.equal( 13 );

			expect( am ).to.not.deep.include( {
				figure: whiteKing,
				type: MoveTypes.CASTLE_QUEENSIDE,
				dest: { x: 2, y: 0 },
			} );
		} );
	} );
} );
