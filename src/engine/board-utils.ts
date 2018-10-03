import Chessboard from "./Chessboard";
import MoveController from "./MoveController";
import { MoveTypes, JSONFigure } from "./utils";
import FigureFactory from "./FigureFactory";
import Board from "./Board";
import ChessFigure from "./figures/ChessFigure";
import { fenParser } from "./Engine";

export function isGameEnd( chessBoard: Chessboard ) : boolean {
	return isCurrentPlayerCheckmated( chessBoard ) || isDraw( chessBoard );
}

export function isCurrentPlayerCheckmated( chessBoard: Chessboard ): boolean  {
	if ( chessBoard.getAvailableMoves().length !== 0 ) {
		return false;
	}

	const cb = MoveController.applyFakeMove( chessBoard );

	const possibleMoves = cb.getPossibleMoves();
	const king = cb.getOpponentKing();

	if ( !king ) {
		// Because in possible moves we can drop the king.
		return false;
	}

	return possibleMoves.some( possibleMove => {
		return (
			possibleMove.dest.x === king.x &&
			possibleMove.dest.y === king.y &&
			possibleMove.type === MoveTypes.CAPTURE
		);
	} );
}

/**
 * Returns whether the current position is drawable.
 *
 * The check for the win needs to be done first.
 */
export function isDraw( chessboard: Chessboard ) : boolean {
	return isNoAvailableMoveDraw( chessboard ) ||
		isThreefoldRepetitionDraw( chessboard ) ||
		isNoCaptureDraw( chessboard );
}

/**
 * The check for the win needs to be done first.
 */
export function isNoAvailableMoveDraw( chessboard: Chessboard ): boolean {
	return chessboard.getAvailableMoves().length === 0;
}

/**
 * @todo
 * @see https://en.wikipedia.org/wiki/Threefold_repetition#The_rule
 */
export function isThreefoldRepetitionDraw( chessboard: Chessboard ): boolean {
	// TODO
	return false;
}

export function isNoCaptureDraw( chessboard: Chessboard ) {
	return chessboard.halfMoveClock > 100;
}

export function createChessBoardAtInitialPosition() {
	return createChessBoardFromFenPosition( 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' );
}

export function createChessBoardFromFenPosition( fenPosition: string ) {
	const {
		figures,
		castling,
		enPassantMove,
		// fullMoveNumber,
		halfMoveClock,
		turnColor
	} = fenParser.parse( fenPosition );

	return createChessBoardFromFigures( figures, turnColor, halfMoveClock, castling, enPassantMove );
}

export function createChessBoardFromFigures(
	figures: ReadonlyArray<ChessFigure>,
	turnColor: 0 | 1 = 0,
	halfMoveClock = 0,
	availableCastles = [ 3, 3 ],
	enPassantMove: null | { x: number, y: number } = null,
) {
	const board = Board.fromFigures( figures );

	return new Chessboard( figures, board, turnColor, halfMoveClock, availableCastles, enPassantMove );
}

export function createChessBoardFromJSON(
	jsonFigures: ReadonlyArray<JSONFigure>,
	turnColor: 0 | 1 = 0,
	moveWithoutCapture = 0,
	availableCastles = [ 3, 3 ],
	enPassantMove: null | { x: number, y: number } = null
) {
	const figures = FigureFactory.createFromJSON( jsonFigures );
	const board = Board.fromFigures( figures );

	return new Chessboard( figures, board, turnColor, moveWithoutCapture, availableCastles, enPassantMove );
}
