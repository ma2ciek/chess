import Chessboard from '../Chessboard';
import ChessFigure from './ChessFigure';

export default class Queen extends ChessFigure {
	public readonly type: 'queen' = 'queen';

	public getAvailableMoves( chessboard: Chessboard ) {
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
