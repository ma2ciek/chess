import Chessboard from '../Chessboard';
import ChessFigure from './ChessFigure';

export default class Bishop extends ChessFigure {
	public type: 'bishop' = 'bishop';

	public getAvailableMoves( chessboard: Chessboard ) {
		return [
			...this.getMovesInDirection( chessboard, 1, 1 ),
			...this.getMovesInDirection( chessboard, -1, -1 ),
			...this.getMovesInDirection( chessboard, 1, -1 ),
			...this.getMovesInDirection( chessboard, -1, 1 ),
		];
	}
}
