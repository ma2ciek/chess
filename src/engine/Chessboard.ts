import { isEqual } from 'lodash';
import Board from './Board';
import ChessFigure from './figures/ChessFigure';
import King from './figures/King';
import MoveController from './MoveController';
import { Color, FigureTypes, Move, MoveTypes } from './utils';

export default class Chessboard {
	// For speed up methods.
	private _opponentKing: King | null = null;
	private _possibleMoves?: ReadonlyArray<Move>;
	private _availableMoves?: ReadonlyArray<Move>;

	constructor(
		public readonly figures: ReadonlyArray<ChessFigure>,
		public readonly board: Board, // Make it pure data.
		public readonly turnColor: 0 | 1,
		public readonly halfMoveClock: number,
		public readonly availableCastles: number[], // [ for white, for black ]
		public readonly enPassantMove: null | { x: number, y: number },
	) { }

	public getTurnDir() {
		return this.turnColor === Color.White ? 1 : -1;
	}

	public isEmptyAt( x: number, y: number ) {
		return !this.board.get( x, y );
	}

	public isOpponentAt( x: number, y: number ) {
		const f = this.getFigureFrom( x, y );
		return f ? f.color !== this.turnColor : false;
	}

	public getFigureFrom( x: number, y: number ) {
		return this.board.get( x, y );
	}

	public isCorrectMove( move: Move ): boolean {
		return this.getAvailableMoves().some( avMove => isEqual( move, avMove ) );
	}

	/**
	 * Get new boards from current board's available moves.
	 */
	public getAvailableBoards(): ReadonlyArray<Chessboard> {
		const moves = this.getPossibleMoves();
		const boards = [];

		for ( const move of moves ) {
			const cb = MoveController.applyMove( this, move );

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

	/**
	 * Takes care about check mates, draws, etc.
	 */
	public getAvailableMoves(): ReadonlyArray<Move> {
		if ( this._availableMoves ) {
			return this._availableMoves;
		}
		const moves = this.getPossibleMoves()
			.filter( move => !this.isCurrentKingCheckedAfterMove( move ) );

		return this._availableMoves = moves;
	}

	/**
	 * Sums all figures possible moves.
	 */
	public getPossibleMoves(): ReadonlyArray<Move> {
		if ( this._possibleMoves ) {
			return this._possibleMoves;
		}

		const moves = [];

		for ( const figure of this.figures ){
			if ( figure.color === this.turnColor ) {
				moves.push( ...figure.getPossibleMoves( this ) );
			}
		}

		return this._possibleMoves = moves;
	}

	/**
	 * TODO: To expensive
	 */
	public isCurrentKingCheckedAfterMove( move: Move ): boolean {
		// We virtually move king to the target position and check whether some figure can move to that place.

		// TODO: static method.
		const cb = MoveController.applyMove( this, move );

		// We made a move, so now our king becomes opponent's king.
		const king = cb.getOpponentKing();
		const possibleMoves = cb.getPossibleMoves();

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

	public getOpponentKing() {
		if ( this._opponentKing ) {
			return this._opponentKing;
		}

		return this._opponentKing = this.figures.find( figure => {
			return figure.type === FigureTypes.KING && figure.color !== this.turnColor;
		} ) as King;
	}
}
