import Board from './Board';
import Chessboard from './Chessboard';
import FigureFactory from './FigureFactory';
import ChessFigure from './figures/ChessFigure';
import King from './figures/King';
import Pawn from './figures/Pawn';
import Queen from './figures/Queen';
import Rook from './figures/Rook';
import { Color, Move, MoveTypes } from './utils';

/**
 * TODO: UndoMoveController
 */
export default class MoveController {
	public static applyMove( chessboard: Chessboard, move: Move ) {
		// TODO: optimization.
		const originalFigures = chessboard.figures;
		const movedFigure = chessboard.board.get( move.figure.x, move.figure.y ) as ChessFigure;
		const rawBoard = chessboard.board.rawBoard.slice( 0 );
		let newFigures: ReadonlyArray<ChessFigure>;

		switch ( move.type ) {
			case MoveTypes.NORMAL:
			case MoveTypes.LONG_MOVE: {
				const figure = FigureFactory.createFigureFromJSON( {
					x: move.dest.x,
					y: move.dest.y,
					color: movedFigure.color,
					type: movedFigure.type,
				} );
				newFigures = originalFigures.filter( f => f !== movedFigure ).concat( figure );
				rawBoard[ move.dest.y * 8 + move.dest.x ] = figure;
				rawBoard[ movedFigure.y * 8 + movedFigure.x ] = undefined;

				break;
			}

			case MoveTypes.CAPTURE: {
				const capturedFigure = chessboard.board.get( move.dest.x, move.dest.y );
				const figure = FigureFactory.createFigureFromJSON( {
					x: move.dest.x,
					y: move.dest.y,
					color: movedFigure.color,
					type: movedFigure.type,
				} );
				newFigures = originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ).concat( figure );

				rawBoard[ move.dest.y * 8 + move.dest.x ] = figure;
				rawBoard[ movedFigure.y * 8 + movedFigure.x ] = undefined;

				break;
			}

			// TODO: Change chessboard method.
			case MoveTypes.EN_PASSANT: {
				const dir = chessboard.getTurnDir();
				const capturedFigure = chessboard.board.get( move.dest.x, move.dest.y - dir ) as Pawn;
				const pawn = new Pawn( move.dest.x, move.dest.y, movedFigure.color );
				newFigures = originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ).concat( pawn );

				rawBoard[ move.dest.y * 8 + move.dest.x ] = pawn;
				rawBoard[ movedFigure.y * 8 + movedFigure.x ] = undefined;
				rawBoard[ capturedFigure.y * 8 + capturedFigure.x ] = undefined;

				break;
			}

			// TODO: enable other figures.
			case MoveTypes.PROMOTION: {
				const queen = new Queen( move.dest.x, move.dest.y, movedFigure.color );
				newFigures = originalFigures.filter( f => f !== movedFigure ).concat( queen );

				rawBoard[ move.dest.y * 8 + move.dest.x ] = queen;
				rawBoard[ movedFigure.y * 8 + movedFigure.x ] = undefined;

				break;
			}

			// TODO: enable other figures.
			case MoveTypes.PROMOTION_CAPTURE: {
				const capturedFigure = chessboard.board.get( move.dest.x, move.dest.y ) as ChessFigure;
				const queen = new Queen( move.dest.x, move.dest.y, movedFigure.color );
				newFigures = originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ).concat( queen );

				rawBoard[ move.dest.y * 8 + move.dest.x ] = queen;
				rawBoard[ movedFigure.y * 8 + movedFigure.x ] = undefined;

				break;
			}

			case MoveTypes.CASTLE_KINGSIDE: {
				const row = movedFigure.color === Color.White ? 0 : 7;
				const king = chessboard.board.get( 4, row ) as King;
				const rook = chessboard.board.get( 7, row ) as Rook;

				const newKing = new King( 6, row, movedFigure.color );
				const newRook = new Rook( 5, row, movedFigure.color );

				rawBoard[ row * 8 + 4 ] = undefined;
				rawBoard[ row * 8 + 7 ] = undefined;

				rawBoard[ row * 8 + 6 ] = newKing;
				rawBoard[ row * 8 + 5 ] = newRook;

				newFigures = originalFigures.filter( f => f !== king && f !== rook ).concat( newKing, newRook );

				break;
			}

			case MoveTypes.CASTLE_QUEENSIDE: {
				const row = movedFigure.color === Color.White ? 0 : 7;

				const king = chessboard.board.get( 4, row ) as King;
				const rook = chessboard.board.get( 0, row ) as Rook;

				const newKing = new King( 2, row, movedFigure.color );
				const newRook = new Rook( 3, row, movedFigure.color );

				rawBoard[ row * 8 + 4 ] = undefined;
				rawBoard[ row * 8 + 0 ] = undefined;

				rawBoard[ row * 8 + 2 ] = newKing;
				rawBoard[ row * 8 + 3 ] = newRook;

				newFigures = originalFigures.filter( f => f !== king && f !== rook ).concat( newKing, newRook );

				break;
			}

			default:
				newFigures = originalFigures;
				console.warn( 'Move type can\'t be handled' );
		}

		return Chessboard.fromExistingFiguresAndBoard( newFigures, new Board( rawBoard ), chessboard.history.moves.concat( move ) );
	}

	// For easy checkmate checks.
	public static applyFakeMove( chessboard: Chessboard ) {
		// TODO: Assert whether this approach is correct.
		const fakeMove: Move = {
			type: MoveTypes.FAKE,
			dest: { x: 0, y: 0 },
			figure: chessboard.figures.find( f => f.color === chessboard.turnColor ) as ChessFigure,
		};
		const originalFigures = chessboard.figures;

		return Chessboard.fromExistingFiguresAndBoard( originalFigures, chessboard.board, chessboard.history.moves.concat( fakeMove ) );
	}
}
