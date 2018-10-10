import { expect } from 'chai';
import {
	createChessBoardAtInitialPosition,
	createChessBoardFromFenPosition,
	createChessBoardFromJSON,
	getAvailableBoards,
	isCurrentPlayerCheckmated,
} from '../../src/engine/board-utils';
import Chessboard from '../../src/engine/Chessboard';
import ChessFigure from '../../src/engine/figures/ChessFigure';
import { Color, FigureTypes } from '../../src/engine/utils';

describe( 'Chessboard', () => {
	it( 'constructor()', () => {
		const cb = createChessBoardFromJSON( [] );

		expect( cb ).to.be.an( 'object' );
	} );

	describe( 'createChessBoardAtInitialPosition()', () => {
		it( 'should return an initialized chessboard', () => {
			const cb = createChessBoardAtInitialPosition();

			expect( cb ).to.be.an( 'object' );
			expect( cb ).to.be.an.instanceOf( Chessboard );
		} );

		it( 'should return a chessboard with 16 white and 16 black figures', () => {
			const cb = createChessBoardAtInitialPosition();

			expect( cb.figures ).to.be.an( 'array' );

			const whiteFigures = cb.figures.filter( f => f.color === 0 );
			const blackFigures = cb.figures.filter( f => f.color === 1 );

			expect( whiteFigures.length ).to.equal( 16 );
			expect( blackFigures.length ).to.equal( 16 );
		} );

		it( 'should have a white king on E1', () => {
			const cb = createChessBoardAtInitialPosition();
			const whiteKing = cb.getFigureFrom( 4, 0 ) as ChessFigure; // E1

			expect( whiteKing.color ).to.equal( Color.White );
			expect( whiteKing.type ).to.equal( FigureTypes.KING );
		} );

		it( 'should have a black king on E8', () => {
			const cb = createChessBoardAtInitialPosition();
			const whiteKing = cb.getFigureFrom( 4, 7 ) as ChessFigure; // E8

			expect( whiteKing.color ).to.equal( Color.Black );
			expect( whiteKing.type ).to.equal( FigureTypes.KING );
		} );

		it( 'should be a white to move', () => {
			const cb = createChessBoardAtInitialPosition();
			expect( cb.turnColor ).to.equal( Color.White );
		} );

		it( 'should create position with 20 start moves available', () => {
			const cb = createChessBoardAtInitialPosition();
			expect( cb.getAvailableMoves().length ).to.equal( 20 );
		} );

		it( 'should create position with 20 moves available for every 2 move', () => {
			const cb = createChessBoardAtInitialPosition();

			for ( const cb2 of getAvailableBoards( cb ) ) {
				expect( cb2.getAvailableMoves().length ).to.equal( 20 );
			}
		} );
	} );

	describe( 'check mates', () => {
		it( 'case #1', () => {
			const cb = createChessBoardFromFenPosition(
				'rnb1k1nr/' +
				'pppp1ppp/' +
				'11111111/' +
				'11b11111/' +
				'11111111/' +
				'11111111/' +
				'PPPPPqPP/' +
				'RNBQKBNR w - - 0 1' );

			expect( isCurrentPlayerCheckmated( cb ) ).to.be.true;
		} );

		it( 'case #2', () => {
			const cb = createChessBoardFromFenPosition(
				'rnb1kbnr/' +
				'pppp1ppp/' +
				'11111111/' +
				'11111111/' +
				'11111111/' +
				'11111111/' +
				'PPPPPqPP/' +
				'RNBQKBNR w - - 0 1' );

			expect( isCurrentPlayerCheckmated( cb ) ).to.be.false;
		} );

		it( 'case #3 - corner, mate for white', () => {
			const cb = createChessBoardFromFenPosition(
				'1111111K/' +
				'111111q1/' +
				'11111k11/' +
				'11111111/' +
				'11111111/' +
				'11111111/' +
				'11111111/' +
				'1111111 w - - 0 1' );

			expect( isCurrentPlayerCheckmated( cb ) ).to.be.true;
		} );

		it( 'case #4 - corner, mate for black', () => {
			const cb = createChessBoardFromFenPosition(
				'1111111k/' +
				'111111Q1/' +
				'11111K11/' +
				'11111111/' +
				'11111111/' +
				'11111111/' +
				'11111111/' +
				'1111111 b - - 0 1' );

			expect( isCurrentPlayerCheckmated( cb ) ).to.be.true;
		} );
	} );
} );
