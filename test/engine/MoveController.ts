import { expect } from 'chai';
import { createChessBoardAtInitialPosition, createChessBoardFromFenPosition } from '../../src/engine/board-utils';
import MoveController from '../../src/engine/MoveController';
import { Color, FigureTypes, JSONFigure, MoveTypes } from '../../src/engine/utils';

describe( 'MoveController', () => {
	describe( 'static applyMove()', () => {
		it( 'should apply normal move on the board', () => {
			const board = createChessBoardAtInitialPosition();

			const nextBoard = MoveController.applyMove( board, {
				type: MoveTypes.NORMAL,
				figure: figure( 'PAWN', 'd2', 0 ),
				dest: dest( 'd3' ),
			} );

			expect( nextBoard.board[ boardDest( 'd3' ) ] ).to.deep.equal(
				figure( 'PAWN', 'd3', 0 ),
			);
		} );

		it( 'should apply long move on the board', () => {
			const board = createChessBoardAtInitialPosition();

			const nextBoard = MoveController.applyMove( board, {
				type: MoveTypes.LONG_MOVE,
				figure: figure( 'PAWN', 'd2', 0 ),
				dest: dest( 'd4' ),
			} );

			expect( nextBoard.board[ boardDest( 'd4' ) ] ).to.deep.equal(
				figure( 'PAWN', 'd4', 0 ),
			);
		} );

		it( 'should apply long move on the board and set en passant move', () => {
			const board = createChessBoardAtInitialPosition();

			const nextBoard = MoveController.applyMove( board, {
				type: MoveTypes.LONG_MOVE,
				figure: figure( 'PAWN', 'd2', 0 ),
				dest: dest( 'd4' ),
			} );

			expect( nextBoard.board[ boardDest( 'd4' ) ] ).to.deep.equal(
				figure( 'PAWN', 'd4', 0 ),
			);

			expect( nextBoard.enPassantMove ).to.deep.equal( dest( 'd3' ) );
		} );

		it( 'should apply long move on the board and set en passant move', () => {
			const board = createChessBoardFromFenPosition(
				'rnbqkbnr/' +
				'ppp1pppp/' +
				'11111111/' +
				'1111P111/' +
				'111p1111/' +
				'11111111/' +
				'PPPP1PPP/' +
				'RNBQKBNR w - - 0 1' );

			const boardForBlack = MoveController.applyMove( board, {
				type: MoveTypes.LONG_MOVE,
				figure: figure( 'PAWN', 'c2', 0 ),
				dest: dest( 'c4' ),
			} );

			// En passant move should be available on the board.
			expect( boardForBlack.getAvailableMoves().find( m => m.type === MoveTypes.EN_PASSANT ) )
				.to.deep.equal( {
					type: MoveTypes.EN_PASSANT,
					figure: figure( 'PAWN', 'd4', 1 ),
					dest: dest( 'c3' ),
				} );

			expect( boardForBlack.enPassantMove ).to.deep.equal( dest( 'c3' ) );

			const nextBoardForWhite = MoveController.applyMove( boardForBlack, {
				type: MoveTypes.EN_PASSANT,
				figure: figure( 'PAWN', 'd4', 1 ),
				dest: dest( 'c3' ),
			} );

			expect( nextBoardForWhite.board[ boardDest( 'c2' ) ] ).to.deep.eq( undefined );
			expect( nextBoardForWhite.board[ boardDest( 'c3' ) ] ).to.deep.eq( figure( 'PAWN', 'c3', 1 ) );
			expect( nextBoardForWhite.board[ boardDest( 'c4' ) ] ).to.deep.eq( undefined );
			expect( nextBoardForWhite.board[ boardDest( 'd4' ) ] ).to.deep.eq( undefined );
		} );
	} );
} );

type Figure = 'PAWN' | 'KNIGHT' | 'BISHOP' | 'ROOK' | 'QUEEN' | 'KING';

function figure( type: Figure, pos: string, color: Color ): JSONFigure {
	return {
		color,
		type: FigureTypes[ type ],
		x: pos.charCodeAt( 0 ) - 97,
		y: pos.charCodeAt( 1 ) - 49,
	};
}

function dest( pos: string ) {
	return {
		x: pos.charCodeAt( 0 ) - 97,
		y: pos.charCodeAt( 1 ) - 49,
	};
}

function boardDest( pos: string ) {
	const vec = dest( pos );

	return vec.y * 8 + vec.x;
}
