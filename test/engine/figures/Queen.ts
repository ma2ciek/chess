import { expect } from 'chai';
import Chessboard from '../../../src/engine/Chessboard';
// import King from '../../../src/engine/figures/King';
import Queen from '../../../src/engine/figures/Queen';
// import { FigureTypes, MoveTypes } from '../../../src/engine/utils';

describe( 'Queen', () => {
	describe( 'getPossibleMoves()', () => {
		it( 'case #1', () => {
			const whiteQueen = new Queen( 0, 0, 0 );
			const cb = Chessboard.fromExistingFigures( [ whiteQueen ], [] );

			const am = whiteQueen.getPossibleMoves( cb );

			expect( am.length ).to.equal( 21 );
		} );

		it( 'case #2', () => {
			const whiteQueen = new Queen( 3, 3, 0 );
			const cb = Chessboard.fromExistingFigures( [ whiteQueen ], [] );

			const am = whiteQueen.getPossibleMoves( cb );

			expect( am.length ).to.equal( 27 );
		} );

		it( 'case #2', () => {
			const whiteQueen = new Queen( 3, 3, 0 );
			const whiteKing = new Queen( 3, 4, 0 );
			const cb = Chessboard.fromExistingFigures( [ whiteQueen, whiteKing ], [] );

			const am = whiteQueen.getPossibleMoves( cb );

			expect( am.length ).to.equal( 23 );
		} );

		it( 'case #3', () => {
			const whiteQueen = new Queen( 3, 3, 0 );
			const blackQueen = new Queen( 3, 5, 1 );
			const cb = Chessboard.fromExistingFigures( [ whiteQueen, blackQueen ], [] );

			const am = whiteQueen.getPossibleMoves( cb );

			expect( am.length ).to.equal( 25 );
		} );
	} );
} );
