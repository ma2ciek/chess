import { isEqual } from 'lodash';
import Chessboard from './Chessboard';
import { fenParser } from './Engine';
import FigureFactory from './FigureFactory';
import ChessFigure from './figures/ChessFigure';
import MoveController from './MoveController';
import { Color, JSONFigure, Move, MoveTypes } from './utils';

export function isGameEnd( chessBoard: Chessboard ): boolean {
	return isCurrentPlayerCheckmated( chessBoard ) || isDraw( chessBoard );
}

export function isCurrentPlayerCheckmated( chessBoard: Chessboard ): boolean {
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
export function isDraw( chessboard: Chessboard ): boolean {
	return isNoAvailableMoveDraw( chessboard ) ||
		isThreefoldRepetitionDraw( chessboard ) ||
		isNoCaptureDraw( chessboard );
}

/**
 * The check for the win needs to be done first.
 */
export function isNoAvailableMoveDraw( chessboard: Chessboard ): boolean {
	// return chessboard.getAvailableMoves().length === 0;

	for ( const figure of chessboard.figures ) {
		if ( figure.color === chessboard.turnColor ) {
			for ( const move of figure.getPossibleMoves( chessboard ) ) {
				if ( !chessboard.isCurrentKingCheckedAfterMove( move ) ) {
					return false;
				}
			}
		}
	}

	return true;
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
		turnColor,
	} = fenParser.parse( fenPosition );

	return createChessBoardFromFigures( figures, turnColor, halfMoveClock, castling, enPassantMove );
}

export function createChessBoardFromFigures(
	figures: ReadonlyArray<ChessFigure>,
	turnColor: Color = Color.White,
	halfMoveClock = 0,
	availableCastles = [ 3, 3 ],
	enPassantMove: null | { x: number, y: number } = null,
) {
	const board = createBoardFromFigures( figures );

	return new Chessboard( figures, board, turnColor, halfMoveClock, availableCastles, enPassantMove );
}

export function createChessBoardFromJSON(
	jsonFigures: ReadonlyArray<JSONFigure>,
	turnColor: Color = Color.White,
	moveWithoutCapture = 0,
	availableCastles = [ 3, 3 ],
	enPassantMove: null | { x: number, y: number } = null,
) {
	const figures = FigureFactory.createFiguresFromJSON( jsonFigures );
	const board = createBoardFromFigures( figures );

	return new Chessboard( figures, board, turnColor, moveWithoutCapture, availableCastles, enPassantMove );
}

/**
 * Get new boards from current board's available moves.
 */
export function getAvailableBoards( chessboard: Chessboard ) {
	const moves = chessboard.getPossibleMoves();
	const boards = [];

	for ( const move of moves ) {
		const cb = MoveController.applyMove( chessboard, move );

		// We made a move, so now our king becomes opponent's king.
		const king = cb.getOpponentKing();
		const possibleMoves = cb.getPossibleMoves();

		if ( !king ) {
			// Because in possible moves we can drop the king.
			continue;
		}

		for ( const possibleMove of possibleMoves ) {
			if (
				possibleMove.dest.x === king.x &&
				possibleMove.dest.y === king.y &&
				possibleMove.type === MoveTypes.CAPTURE
			) {
				continue;
			}
		}

		boards.push( cb );
	}

	return boards;
}

/*
 * Be careful - expensive
 */
export function isCorrectMove( board: Chessboard, move: Move ): boolean {
	return board.getAvailableMoves().some( avMove => isEqual( move, avMove ) );
}

export function createBoardFromFigures( figures: ReadonlyArray<ChessFigure> ) {
	const rawBoard: ChessFigure[] = new Array( 64 );

	for ( const figure of figures ) {
		rawBoard[ figure.y * 8 + figure.x ] = figure;
	}

	return rawBoard;
}
