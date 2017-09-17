import Chessboard from './Chessboard';
import { IMove, JSONFigure } from './utils';

/**
 * TODO: UndoMoveController
 */
export default class MoveController {
	public applyMove( chessboard: Chessboard, move: IMove ) {
		const originalFigures = chessboard.getClonedFigures();
		const movedFigure = originalFigures.find( f => f.x === move.figure.x && f.y === move.figure.y );

		// TODO - move to static figure methods.

		switch ( move.type ) {
			// For easy checkmate checks.
			case 'fake':
				return new Chessboard( originalFigures, [ ...chessboard.history.moves, move ] );

			case 'normal':
			case 'long-move': {
				const figure = { ...movedFigure, x: move.dest.x, y: move.dest.y };
				const newFigures = [ ...originalFigures.filter( f => f !== movedFigure ), figure ];

				return new Chessboard( newFigures, [ ...chessboard.history.moves, move ] );
			}

			case 'capture': {
				const capturedFigure = originalFigures.find( f => f.x === move.dest.x && f.y === move.dest.y );
				const figure = { ...movedFigure, x: move.dest.x, y: move.dest.y };
				const newFigures = [ ...originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ), figure ];

				return new Chessboard( newFigures, [ ...chessboard.history.moves, move ] );
			}

			case 'en-passant': {
				const dir = movedFigure.color === 0 ? 1 : -1;
				const capturedFigure = originalFigures.find( f => f.x === move.dest.x && f.y === move.dest.y - dir );
				const figure = { ...movedFigure, x: move.dest.x, y: move.dest.y };
				const newFigures = [ ...originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ), figure ];

				return new Chessboard( newFigures, [ ...chessboard.history.moves, move ] );
			}

			// TODO - enable other figures.
			case 'promotion-move': {
				const figure: JSONFigure = { ...movedFigure, x: move.dest.x, y: move.dest.y, type: 'queen' };
				const newFigures = [ ...originalFigures.filter( f => f !== movedFigure ), figure ];

				return new Chessboard( newFigures, [ ...chessboard.history.moves, move ] );
			}

			case 'promotion-capture': {
				const capturedFigure = originalFigures.find( f => f.x === move.dest.x && f.y === move.dest.y );
				const figure: JSONFigure = { ...movedFigure, x: move.dest.x, y: move.dest.y, type: 'queen' };
				const newFigures = [ ...originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ), figure ];

				return new Chessboard( newFigures, [ ...chessboard.history.moves, move ] );
			}

			case 'o-o': {
				const row = movedFigure.color === 0 ? 0 : 7;
				const king = originalFigures.find( f => f.x === 4 && f.y === row );
				const rook = originalFigures.find( f => f.x === 7 && f.y === row );

				const newKing = { ...king, x: 6, y: row };
				const newRook = { ...rook, x: 5, y: row };

				const newFigures = [ ...originalFigures.filter( f => f !== king && f !== rook ), newKing, newRook ];

				return new Chessboard( newFigures, [ ...chessboard.history.moves, move ] );
			}

			case 'o-o-o': {
				const row = movedFigure.color === 0 ? 0 : 7;
				const king = originalFigures.find( f => f.x === 4 && f.y === row );
				const rook = originalFigures.find( f => f.x === 0 && f.y === row );

				const newKing = { ...king, x: 2, y: row };
				const newRook = { ...rook, x: 3, y: row };

				const newFigures = [ ...originalFigures.filter( f => f !== king && f !== rook ), newKing, newRook ];

				return new Chessboard( newFigures, [ ...chessboard.history.moves, move ] );
			}

			default:
				throw new Error( `${ move.type } is not implemented yet.` );
		}
	}
}
