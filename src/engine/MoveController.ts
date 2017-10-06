import Board from './Board';
import Chessboard from './Chessboard';
import FigureFactory from './FigureFactory';
import ChessFigure from './figures/ChessFigure';
import King from './figures/King';
import Pawn from './figures/Pawn';
import Queen from './figures/Queen';
import Rook from './figures/Rook';
import { Move, MoveTypes } from './utils';

/**
 * TODO: UndoMoveController
 */
export default class MoveController {
	public static applyMove( chessboard: Chessboard, move: Move ) {
		// TODO: optimization.
		const originalFigures = chessboard.figures;
		const movedFigure = chessboard.board.get( move.figure.x, move.figure.y ) as ChessFigure;

		// TODO: move to static figure methods.

		switch ( move.type ) {
			// For easy checkmate checks.
			case MoveTypes.FAKE:
				return Chessboard.fromExistingFiguresAndBoard( originalFigures, chessboard.board, chessboard.history.moves.concat( move ) );

			case MoveTypes.NORMAL:
			case MoveTypes.LONG_MOVE: {
				const figure = FigureFactory.createFigureFromJSON( {
					x: move.dest.x,
					y: move.dest.y,
					color: movedFigure.color,
					type: movedFigure.type,
				} );
				const newFigures = [ ...originalFigures.filter( f => f !== movedFigure ), figure ];
				const rawBoard = chessboard.board.rawBoard.slice( 0 );
				rawBoard[ move.dest.y * 8 + move.dest.x ] = figure;
				rawBoard[ movedFigure.y * 8 + movedFigure.x ] = undefined;

				return Chessboard.fromExistingFiguresAndBoard( newFigures, new Board( rawBoard ), chessboard.history.moves.concat( move ) );
			}

			case MoveTypes.CAPTURE: {
				const capturedFigure = chessboard.board.get( move.dest.x, move.dest.y );
				const figure = FigureFactory.createFigureFromJSON( {
					x: move.dest.x,
					y: move.dest.y,
					color: movedFigure.color,
					type: movedFigure.type,
				} );
				const newFigures = originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ).concat( figure );

				const rawBoard = chessboard.board.rawBoard.slice( 0 );
				rawBoard[ move.dest.y * 8 + move.dest.x ] = figure;
				rawBoard[ movedFigure.y * 8 + movedFigure.x ] = undefined;

				return Chessboard.fromExistingFiguresAndBoard( newFigures, new Board( rawBoard ), chessboard.history.moves.concat( move ) );
			}

			// TODO: Change chessboard method.
			case MoveTypes.EN_PASSANT: {
				const dir = movedFigure.color === 0 ? 1 : -1;
				const capturedFigure = chessboard.board.get( move.dest.x, move.dest.y - dir ) as Pawn;
				const pawn = new Pawn( move.dest.x, move.dest.y, movedFigure.color );
				const newFigures = originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ).concat( pawn );

				const rawBoard = chessboard.board.rawBoard.slice( 0 );
				rawBoard[ move.dest.y * 8 + move.dest.x ] = pawn;
				rawBoard[ movedFigure.y * 8 + movedFigure.x ] = undefined;
				rawBoard[ capturedFigure.y * 8 + capturedFigure.x ] = undefined;

				return Chessboard.fromExistingFiguresAndBoard( newFigures, new Board( rawBoard ), chessboard.history.moves.concat( move ) );
			}

			// TODO: enable other figures.
			case MoveTypes.PROMOTION: {
				const queen = new Queen( move.dest.x, move.dest.y, movedFigure.color );
				const newFigures = originalFigures.filter( f => f !== movedFigure ).concat( queen );
				const rawBoard = chessboard.board.rawBoard.slice( 0 );
				rawBoard[ move.dest.y * 8 + move.dest.x ] = queen;
				rawBoard[ movedFigure.y * 8 + movedFigure.x ] = undefined;

				return Chessboard.fromExistingFiguresAndBoard( newFigures, new Board( rawBoard ), chessboard.history.moves.concat( move ) );
			}

			// TODO: enable other figures.
			case MoveTypes.PROMOTION_CAPTURE: {
				const capturedFigure = chessboard.board.get( move.dest.x, move.dest.y ) as ChessFigure;
				const queen = new Queen( move.dest.x, move.dest.y, movedFigure.color );
				const newFigures = originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ).concat( queen );
				const rawBoard = chessboard.board.rawBoard.slice( 0 );
				rawBoard[ move.dest.y * 8 + move.dest.x ] = queen;
				rawBoard[ movedFigure.y * 8 + movedFigure.x ] = undefined;

				return Chessboard.fromExistingFiguresAndBoard( newFigures, new Board( rawBoard ), chessboard.history.moves.concat( move ) );
			}

			case MoveTypes.CASTLE_KINGSIDE: {
				const row = movedFigure.color === 0 ? 0 : 7;
				const king = chessboard.board.get( 4, row ) as King;
				const rook = chessboard.board.get( 7, row ) as Rook;

				const newKing = new King( 6, row, movedFigure.color );
				const newRook = new Rook( 5, row, movedFigure.color );

				const rawBoard = chessboard.board.rawBoard.slice( 0 );
				rawBoard[ row + 4 ] = undefined;
				rawBoard[ row + 7 ] = undefined;

				rawBoard[ row + 6 ] = king;
				rawBoard[ row + 5 ] = rook;

				const newFigures = originalFigures.filter( f => f !== king && f !== rook ).concat( newKing, newRook );

				return Chessboard.fromExistingFiguresAndBoard( newFigures, new Board( rawBoard ), chessboard.history.moves.concat( move ) );
			}

			case MoveTypes.CASTLE_QUEENSIDE: {
				const row = movedFigure.color === 0 ? 0 : 7;

				const king = chessboard.board.get( 4, row ) as King;
				const rook = chessboard.board.get( 0, row ) as Rook;

				const newKing = new King( 2, row, movedFigure.color );
				const newRook = new Rook( 3, row, movedFigure.color );

				const rawBoard = chessboard.board.rawBoard.slice( 0 );
				rawBoard[ row + 4 ] = undefined;
				rawBoard[ row + 0 ] = undefined;

				rawBoard[ row + 2 ] = king;
				rawBoard[ row + 3 ] = rook;

				const newFigures = originalFigures.filter( f => f !== king && f !== rook ).concat( newKing, newRook );

				return Chessboard.fromExistingFiguresAndBoard( newFigures, new Board( rawBoard ), chessboard.history.moves.concat( move ) );
			}

			default:
				throw new Error( `${ move.type } is not implemented yet.` );
		}
	}
}
