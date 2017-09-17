import Chessboard from '../Chessboard';
import ChessFigure from './ChessFigure';

export default class Rook extends ChessFigure {
	public readonly type: 'rook' = 'rook';

	public getAvailableMoves( chessboard: Chessboard ) {
		return [
			...this.getMovesInDirection( chessboard, 1, 0 ),
			...this.getMovesInDirection( chessboard, -1, 0 ),
			...this.getMovesInDirection( chessboard, 0, 1 ),
			...this.getMovesInDirection( chessboard, 0, -1 ),
		];
	}
}
