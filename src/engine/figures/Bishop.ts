import Chessboard from '../Chessboard';
import ChessFigure from './ChessFigure';

export default class Bishop extends ChessFigure {
	public readonly type: 'bishop' = 'bishop';

	public getPossibleMoves( chessboard: Chessboard ) {
		return [
			...this.getMovesInDirection( chessboard, 1, 1 ),
			...this.getMovesInDirection( chessboard, -1, -1 ),
			...this.getMovesInDirection( chessboard, 1, -1 ),
			...this.getMovesInDirection( chessboard, -1, 1 ),
		];
	}
}
