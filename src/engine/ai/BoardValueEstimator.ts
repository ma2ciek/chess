import Chessboard from '../Chessboard';
import { FigureTypes } from '../utils';

export const figureValueMap: { [ name: number ]: number } = {
	[ FigureTypes.KING ]: 1000, // Can't be removed from board.
	[ FigureTypes.QUEEN ]: 9,
	[ FigureTypes.PAWN ]: 1,
	[ FigureTypes.ROOK ]: 5,
	[ FigureTypes.BISHOP ]: 3,
	[ FigureTypes.KNIGHT ]: 3,
};

interface PositionMap {
	[ key: string ]: number
}

export default class BoardValueEstimator {
	/**
	 * A <board position, value> map.
	 */
	private positionMaps: { [ key: number ]: PositionMap } = {};

	public clearAll() {
		this.positionMaps = {};
	}

	/**
	 * Clears position maps up to the specified turn.
	 * 
	 * @param turn 
	 */
	public clear( turn: number ) {
		this.positionMaps[ turn ] = {};

		while ( this.positionMaps[ --turn ] && Object.keys( this.positionMaps[ --turn ] ).length ) {
			this.positionMaps[ turn ] = {};
		}
	}

	public includes( board: Chessboard ) {
		const boardSymbol = board.getBoardPositionId();
		const turn = board.turn;

		return turn in this.positionMaps && boardSymbol in this.positionMaps[ turn ];
	}

	/**
	 * Estimates board value position for the current player.
	 * 
	 * @param board
	 */
	public estimateValue( board: Chessboard ) {
		const boardSymbol = board.getBoardPositionId();
		const turn = board.turn;
		const playerColor = board.turnColor;

		if ( !this.positionMaps[ turn ] ) {
			this.positionMaps[ turn ] = {};
		}

		const storedValue = this.positionMaps[ turn ][ boardSymbol ];

		if ( storedValue ) {
			return storedValue;
		}

		const lastMove = board.history.getLastMove();
		let sum = 0;

		// TODO: optimization - draws, checkmates, etc.

		let myFigures = 0;
		let oppFigures = 0;

		for ( const f of board.figures ) {
			if ( f.color === playerColor ) {
				sum += figureValueMap[ f.type ];
				myFigures++;
			} else {
				sum -= figureValueMap[ f.type ];
				oppFigures++;
			}
		}

		// Do not move king and rocks at the start positions
		if ( lastMove && lastMove.figure.type === FigureTypes.KING ) {
			sum -= 0.3;
		}

		// Endgame.
		if ( oppFigures < 10 ) {
			// Move opponent king to the side.
			const king = board.getOpponentKing();
			const additional = Math.abs( king.x - 4 ) + Math.abs( king.y - 4 );

			sum += additional / ( myFigures + oppFigures );
		}

		sum += Math.random() / 2 - 0.25;

		sum += board.getPossibleMoves().length / 100;

		this.positionMaps[ turn ][ boardSymbol ] = sum;

		return sum;
	}
}
