import Chessboard from './Chessboard';
import FigureFactory from './FigureFactory';
import ChessFigure from './figures/ChessFigure';
import King from './figures/King';
import Queen from './figures/Queen';
import Rook from './figures/Rook';
import { Move } from './utils';

/**
 * TODO: UndoMoveController
 */
export default class MoveController {
	public applyMove( chessboard: Chessboard, move: Move ) {
		// TODO: optimization.
		const originalFigures = chessboard.figures;
		const movedFigure = originalFigures.find( f => f.x === move.figure.x && f.y === move.figure.y ) as ChessFigure;

		// TODO: move to static figure methods.

		switch ( move.type ) {
			// For easy checkmate checks.
			case 'fake':
				return Chessboard.fromExistingFigures( originalFigures, [ ...chessboard.history.moves, move ] );

			case 'normal':
			case 'long-move': {
				const figure = FigureFactory.createFigureFromJSON( { ...movedFigure.toJSON(), x: move.dest.x, y: move.dest.y } );
				const newFigures = [ ...originalFigures.filter( f => f !== movedFigure ), figure ];

				return Chessboard.fromExistingFigures( newFigures, [ ...chessboard.history.moves, move ] );
			}

			case 'capture': {
				const capturedFigure = originalFigures.find( f => f.x === move.dest.x && f.y === move.dest.y );
				const figure = FigureFactory.createFigureFromJSON( { ...movedFigure.toJSON(), x: move.dest.x, y: move.dest.y } );
				const newFigures: ReadonlyArray<ChessFigure> = [ ...originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ), figure ];

				return Chessboard.fromExistingFigures( newFigures, [ ...chessboard.history.moves, move ] );
			}

			case 'en-passant': {
				const dir = movedFigure.color === 0 ? 1 : -1;
				const capturedFigure = originalFigures.find( f => f.x === move.dest.x && f.y === move.dest.y - dir ) as ChessFigure;
				const figure = FigureFactory.createFigureFromJSON( { ...movedFigure.toJSON(), x: move.dest.x, y: move.dest.y } );
				const newFigures: ReadonlyArray<ChessFigure> = [ ...originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ), figure ];

				return Chessboard.fromExistingFigures( newFigures, [ ...chessboard.history.moves, move ] );
			}

			// TODO: enable other figures.
			case 'promotion-move': {
				const queen = new Queen( move.dest.x, move.dest.y, movedFigure.color );
				const newFigures: ReadonlyArray<ChessFigure> = [ ...originalFigures.filter( f => f !== movedFigure ), queen ];

				return Chessboard.fromExistingFigures( newFigures, [ ...chessboard.history.moves, move ] );
			}

			// TODO: enable other figures.
			case 'promotion-capture': {
				const capturedFigure = originalFigures.find( f => f.x === move.dest.x && f.y === move.dest.y ) as ChessFigure;
				const queen = new Queen( move.dest.x, move.dest.y, movedFigure.color );
				const newFigures: ReadonlyArray<ChessFigure> = [ ...originalFigures.filter( f => f !== movedFigure && f !== capturedFigure ), queen ];

				return Chessboard.fromExistingFigures( newFigures, [ ...chessboard.history.moves, move ] );
			}

			case 'o-o': {
				const row = movedFigure.color === 0 ? 0 : 7;
				const king = originalFigures.find( f => f.x === 4 && f.y === row ) as ChessFigure;
				const rook = originalFigures.find( f => f.x === 7 && f.y === row ) as ChessFigure;

				const newKing = new King( 6, row, movedFigure.color );
				const newRook = new Rook( 5, row, movedFigure.color );

				const newFigures: ReadonlyArray<ChessFigure> = [ ...originalFigures.filter( f => f !== king && f !== rook ), newKing, newRook ];

				return Chessboard.fromExistingFigures( newFigures, [ ...chessboard.history.moves, move ] );
			}

			case 'o-o-o': {
				const row = movedFigure.color === 0 ? 0 : 7;
				const king = originalFigures.find( f => f.x === 4 && f.y === row ) as ChessFigure;
				const rook = originalFigures.find( f => f.x === 0 && f.y === row ) as ChessFigure;

				const newKing = new King( 2, row, movedFigure.color );
				const newRook = new Rook( 3, row, movedFigure.color );

				const newFigures: ReadonlyArray<ChessFigure> = [ ...originalFigures.filter( f => f !== king && f !== rook ), newKing, newRook ];

				return Chessboard.fromExistingFigures( newFigures, [ ...chessboard.history.moves, move ] );
			}

			default:
				throw new Error( `${ move.type } is not implemented yet.` );
		}
	}
}
