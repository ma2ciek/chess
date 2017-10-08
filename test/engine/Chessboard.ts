import { expect } from 'chai';
import Chessboard from '../../src/engine/Chessboard';
import ChessFigure from '../../src/engine/figures/ChessFigure';
import MoveController from '../../src/engine/MoveController';
import { Color, FigureTypes } from '../../src/engine/utils';

describe( 'Chessboard', () => {
	it( 'constructor()', () => {
		const cb = Chessboard.fromJSON( [] );

		expect( cb ).to.be.an( 'object' );
	} );

	describe( 'static createInitialPosition()', () => {
		it( 'should return an initialized chessboard', () => {
			const cb = Chessboard.createInitialPosition();

			expect( cb ).to.be.an( 'object' );
			expect( cb ).to.be.an.instanceOf( Chessboard );
		} );

		it( 'should return a chessboard with 16 white and 16 black figures', () => {
			const cb = Chessboard.createInitialPosition();

			expect( cb.figures ).to.be.an( 'array' );

			const whiteFigures = cb.figures.filter( f => f.color === 0 );
			const blackFigures = cb.figures.filter( f => f.color === 1 );

			expect( whiteFigures.length ).to.equal( 16 );
			expect( blackFigures.length ).to.equal( 16 );
		} );

		it( 'should have a white king on E1', () => {
			const cb = Chessboard.createInitialPosition();
			const whiteKing = cb.getFigureFrom( 4, 0 ) as ChessFigure; // E1

			expect( whiteKing.color ).to.equal( Color.White );
			expect( whiteKing.type ).to.equal( FigureTypes.KING );
		} );

		it( 'should have a black king on E8', () => {
			const cb = Chessboard.createInitialPosition();
			const whiteKing = cb.getFigureFrom( 4, 7 ) as ChessFigure; // E8

			expect( whiteKing.color ).to.equal( Color.Black );
			expect( whiteKing.type ).to.equal( FigureTypes.KING );
		} );

		it( 'should be a white to move', () => {
			const cb = Chessboard.createInitialPosition();
			expect( cb.turnColor ).to.equal( Color.White );
		} );

		it( 'should create position with 20 start moves available', () => {
			const cb = Chessboard.createInitialPosition();
			expect( cb.getAvailableMoves().length ).to.equal( 20 );
		} );

		it( 'should create position with 20 moves available for every 2 move', () => {
			const cb = Chessboard.createInitialPosition();

			for ( const m of cb.getAvailableMoves() ) {
				const m2 = MoveController.applyMove( cb, m );
				expect( m2.getAvailableMoves().length ).to.equal( 20 );
			}
		} );
	} );
} );
