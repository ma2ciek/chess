import Chessboard from '../Chessboard';
import { FigureTypes } from '../utils';
import ChessFigure from './ChessFigure';

export default class Rook extends ChessFigure {
	public readonly type = FigureTypes.ROOK;

	public get shortName() {
		return this.color ? 'r' : 'R';
	}

	public getPossibleMoves( chessboard: Chessboard ) {
		return [
			...this.getMovesInDirection( chessboard, 1, 0 ),
			...this.getMovesInDirection( chessboard, -1, 0 ),
			...this.getMovesInDirection( chessboard, 0, 1 ),
			...this.getMovesInDirection( chessboard, 0, -1 ),
		];
	}
}
