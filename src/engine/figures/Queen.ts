import Chessboard from '../Chessboard';
import { FigureTypes } from '../utils';
import ChessFigure from './ChessFigure';

export default class Queen extends ChessFigure {
	public readonly type = FigureTypes.QUEEN;

	public get shortName() {
		return this.color ? 'q' : 'Q';
	}

	public getPossibleMoves( chessboard: Chessboard ) {
		return [
			...this.getMovesInDirection( chessboard, -1, -1 ),
			...this.getMovesInDirection( chessboard, -1, 0 ),
			...this.getMovesInDirection( chessboard, -1, 1 ),
			...this.getMovesInDirection( chessboard, 0, -1 ),
			...this.getMovesInDirection( chessboard, 0, 1 ),
			...this.getMovesInDirection( chessboard, 1, -1 ),
			...this.getMovesInDirection( chessboard, 1, 0 ),
			...this.getMovesInDirection( chessboard, 1, 1 ),
		];
	}
}
