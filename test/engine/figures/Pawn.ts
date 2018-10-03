import { expect } from 'chai';
import Pawn from '../../../src/engine/figures/Pawn';
import Queen from '../../../src/engine/figures/Queen';
import MoveController from '../../../src/engine/MoveController';
import { FigureTypes, Move, MoveTypes } from '../../../src/engine/utils';
import { createChessBoardFromFigures } from '../../../src/engine/board-utils';

describe( 'Pawn', () => {
	describe( 'promotion', () => {
		it( 'pawn should be able to promote to queen', () => {
			const whitePawn = new Pawn( 0, 6, 0 );
			const cb = createChessBoardFromFigures( [ whitePawn ] );

			const move: Move = {
				figure: whitePawn.toJSON(),
				dest: {
					x: 0,
					y: 7,
				},
				type: MoveTypes.PROMOTION,
			};

			const cb2 = MoveController.applyMove( cb, move );

			const queen = cb2.getFigureFrom( 0, 7 ) as Queen;

			expect( queen ).to.be.an.instanceOf( Queen );
			expect( queen.type ).to.equal( FigureTypes.QUEEN );
		} );

		it( 'should be available for a pawn', () => {
			const whitePawn = new Pawn( 0, 6, 0 );
			const cb = createChessBoardFromFigures( [ whitePawn ] );
			const am = whitePawn.getPossibleMoves( cb );

			expect( am.length ).to.equal( 1 );
			expect( am[ 0 ].type ).to.equal( MoveTypes.PROMOTION );
			expect( am[ 0 ].dest ).to.deep.equal( { x: 0, y: 7 } );
			expect( am[ 0 ].figure.type ).to.equal( FigureTypes.PAWN );
		} );
	} );
} );
