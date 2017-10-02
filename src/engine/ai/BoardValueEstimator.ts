import Chessboard from '../Chessboard';
import { FigureTypes } from '../utils';

export const figureValueMap: { [ name: number ]: number } = {
	[ FigureTypes.KING ]: 1000, // Can't be removed from board.
	[ FigureTypes.QUEEN ] : 9,
	[ FigureTypes.PAWN ]: 1,
	[ FigureTypes.ROOK ]: 5,
	[ FigureTypes.BISHOP ]: 3,
	[ FigureTypes.KNIGHT ]: 3,
};

export default class BoardValueEstimator {
	private positionMap: Array<{ [ key: string ]: number }> = [];

	public clearAll() {
		this.positionMap = [];
	}

	public clear( turn: number ) {
		this.positionMap[ turn ] = {};
		this.positionMap[ turn - 1 ] = {};
		this.positionMap[ turn - 2 ] = {};
	}

	public estimateValue( board: Chessboard, playerColor: number ) {
		const boardSymbol = board.getBoardSymbol();
		const turn = board.turn;

		if ( !this.positionMap[ turn ] ) {
			this.positionMap[ turn ] = {};
		}
		const storedValue = this.positionMap[ turn ][ boardSymbol ];

		if ( storedValue ) {
			return storedValue;
		}

		const lastMove = board.history.getLastMove();
		let sum = 0;

		// TODO: optimization
		// if ( board.isDraw() ) {
		// 	return 0;
		// }

		// if ( board.isCheckMate() ) {
		// 	return -1000;
		// }

		// if ( board.isCurrentKingChecked() ) {
		// 	sum -= 0.1;
		// }

		for ( const f of board.figures ) {
			if ( f.color === playerColor ) {
				sum += figureValueMap[ f.type ];
			} else {
				sum -= figureValueMap[ f.type ];
			}
		}

		if ( lastMove.figure.type === FigureTypes.KING && lastMove.figure.color === playerColor ) {
			sum -= 0.3;
		}

		sum += Math.random() / 2 - 0.25;

		sum += board.getPossibleMoves().length / 100;

		this.positionMap[ turn ][ boardSymbol ] = sum;

		return sum;
	}
}
