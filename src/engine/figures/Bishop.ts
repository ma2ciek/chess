import Chessboard from '../Chessboard';
import { FigureTypes } from '../utils';
import ChessFigure from './ChessFigure';

export default class Bishop extends ChessFigure {
	public readonly type = FigureTypes.BISHOP;

	public get shortName() {
		return this.color ? 'b' : 'B';
	}

	public getPossibleMoves( chessboard: Chessboard ) {
		return this.getMovesInDirections( chessboard, moves );
	}
}

const moves: ReadonlyArray<ReadonlyArray<number>> = [
	[ -1, -1 ],
	[ -1, 1 ],
	[ 1, -1 ],
	[ 1, 1 ],
];
