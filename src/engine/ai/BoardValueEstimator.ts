import Chessboard from '../Chessboard';
import { FigureTypes } from '../utils';
import { stringify } from '../fenParser';

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
	public clear() {
		this.positionMaps = {};
	}

	/**
	 * Estimates board value position for the current player.
	 *
	 * @param board
	 */
	public estimateValue( board: Chessboard ) {
		const boardSymbol = stringify( board );
		const turn = board.turnColor;
		const playerColor = board.turnColor;

		if ( !this.positionMaps[ turn ] ) {
			this.positionMaps[ turn ] = {};
		}

		const storedValue = this.positionMaps[ turn ][ boardSymbol ];

		if ( storedValue ) {
			return storedValue;
		}

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

		// Endgame.
		if ( oppFigures < 10 ) {
			// Move opponent king to the side.
			const king = board.getOpponentKing();
			if ( !king ) {
				return 1000;
			}
			const additional = Math.abs( king.x - 4 ) + Math.abs( king.y - 4 );

			sum += additional / ( myFigures + oppFigures );
		}

		sum += Math.random() / 2 - 0.25;

		sum += board.getPossibleMoves().length / 100;

		this.positionMaps[ turn ][ boardSymbol ] = sum;

		return sum;
	}
}
