import Chessboard from '../Chessboard';
import { FigureTypes } from '../utils';
import ChessFigure from './ChessFigure';

export default class Rook extends ChessFigure {
	public readonly type = FigureTypes.ROOK;

	public get shortName() {
		return this.color ? 'r' : 'R';
	}

	public getPossibleMoves( chessboard: Chessboard ) {
		return this.getMovesInDirections( chessboard, moves );
	}
}

const moves: ReadonlyArray<ReadonlyArray<number>> = [
	[ -1, 0 ],
	[ 0, -1 ],
	[ 0, 1 ],
	[ 1, 0 ],
];
