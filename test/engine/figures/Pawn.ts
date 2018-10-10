import { expect } from 'chai';
import { createChessBoardFromFigures } from '../../../src/engine/board-utils';
import Pawn from '../../../src/engine/figures/Pawn';
import MoveController from '../../../src/engine/MoveController';
import { FigureTypes, Move, MoveTypes } from '../../../src/engine/utils';

describe( 'Pawn', () => {
	describe( 'promotion', () => {
		it( 'pawn should be able to promote to queen', () => {
			const whitePawn = new Pawn( 0, 6, 0 );
			const cb = createChessBoardFromFigures( [ whitePawn ] );

			const move: Move = {
				figure: whitePawn,
				dest: {
					x: 0,
					y: 7,
				},
				type: MoveTypes.PROMOTION,
			};

			const cb2 = MoveController.applyMove( cb, move );
			const queen = cb2.getFigureFrom( 0, 7 )!;

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

	describe( 'in the first move', () => {
		it( 'should be able to move by one or by two fields', () => {
			const whitePawn = new Pawn( 0, 1, 0 );
			const cb = createChessBoardFromFigures( [ whitePawn ] );
			const am = whitePawn.getPossibleMoves( cb );

			expect( am.length ).to.equal( 2 );

			expect( am[ 0 ].type ).to.equal( MoveTypes.NORMAL );
			expect( am[ 0 ].dest ).to.deep.equal( { x: 0, y: 2 } );
			expect( am[ 0 ].figure.type ).to.equal( FigureTypes.PAWN );

			expect( am[ 1 ].type ).to.equal( MoveTypes.LONG_MOVE );
			expect( am[ 1 ].dest ).to.deep.equal( { x: 0, y: 3 } );
			expect( am[ 1 ].figure.type ).to.equal( FigureTypes.PAWN );
		} );

		it( 'should be able to move by one if the second filed is occupied', () => {
			const whitePawn = new Pawn( 0, 1, 0 );
			const blackPawn = new Pawn( 0, 3, 1 );
			const cb = createChessBoardFromFigures( [ whitePawn, blackPawn ] );
			const am = whitePawn.getPossibleMoves( cb );

			expect( am.length ).to.equal( 1 );

			expect( am[ 0 ].type ).to.equal( MoveTypes.NORMAL );
			expect( am[ 0 ].dest ).to.deep.equal( { x: 0, y: 2 } );
			expect( am[ 0 ].figure.type ).to.equal( FigureTypes.PAWN );
		} );

		it( 'should not be able to move if the field after the pawn is occupied', () => {
			const whitePawn = new Pawn( 0, 1, 0 );
			const blackPawn = new Pawn( 0, 2, 1 );
			const cb = createChessBoardFromFigures( [ whitePawn, blackPawn ] );
			const am = whitePawn.getPossibleMoves( cb );

			expect( am.length ).to.equal( 0 );
		} );

		it( 'should be able to hit other figures on the axis next to the pawn', () => {
			const whitePawn = new Pawn( 1, 1, 0 );
			const blackPawn0 = new Pawn( 0, 2, 1 );
			const blackPawn1 = new Pawn( 1, 2, 1 );
			const blackPawn2 = new Pawn( 2, 2, 1 );
			const cb = createChessBoardFromFigures( [ whitePawn, blackPawn0, blackPawn1, blackPawn2 ] );
			const am = whitePawn.getPossibleMoves( cb );

			expect( am.length ).to.equal( 2 );

			expect( am[ 0 ].type ).to.equal( MoveTypes.CAPTURE );
			expect( am[ 0 ].dest ).to.deep.equal( { x: 2, y: 2 } );
			expect( am[ 0 ].figure.type ).to.equal( FigureTypes.PAWN );

			expect( am[ 1 ].type ).to.equal( MoveTypes.CAPTURE );
			expect( am[ 1 ].dest ).to.deep.equal( { x: 0, y: 2 } );
			expect( am[ 1 ].figure.type ).to.equal( FigureTypes.PAWN );
		} );
	} );

	describe( 'en passant', () => {
		it( 'should be possible for the opponent after the long move', () => {
			const whitePawn = new Pawn( 1, 1, 0 );
			const cb = createChessBoardFromFigures( [ whitePawn ] );

			const longMove = {
				type: MoveTypes.LONG_MOVE,
				dest: { x: 1, y: 3 },
				figure: whitePawn,
			};

			const nextCb = MoveController.applyMove( cb, longMove );

			expect( nextCb.enPassantMove ).to.deep.equal( { x: 1, y: 2 } );
		} );

		it( 'should not be possible after the normal move', () => {
			const whitePawn = new Pawn( 1, 2, 0 );
			const cb = createChessBoardFromFigures( [ whitePawn ] );

			const normalMove = {
				type: MoveTypes.NORMAL,
				dest: { x: 1, y: 3 },
				figure: whitePawn,
			};

			const nextCb = MoveController.applyMove( cb, normalMove );

			expect( nextCb.enPassantMove ).to.equal( null );
		} );

		it( 'should not be possible after the normal move #2', () => {
			const whitePawn = new Pawn( 1, 1, 0 );
			const cb = createChessBoardFromFigures( [ whitePawn ] );

			const normalMove = {
				type: MoveTypes.NORMAL,
				dest: { x: 1, y: 2 },
				figure: whitePawn,
			};

			const nextCb = MoveController.applyMove( cb, normalMove );

			expect( nextCb.enPassantMove ).to.equal( null );
		} );
	} );
} );
