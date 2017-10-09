import Chessboard from '../Chessboard';
import { FigureTypes } from '../utils';
import ChessFigure from './ChessFigure';

export default class Queen extends ChessFigure {
	public readonly type = FigureTypes.QUEEN;

	public get shortName() {
		return this.color ? 'q' : 'Q';
	}

	public getPossibleMoves( chessboard: Chessboard ) {
		return this.getMovesInDirections( chessboard, moves );
	}
}

const moves: ReadonlyArray<ReadonlyArray<number>> = [
	[ -1, -1 ],
	[ -1, 0 ],
	[ -1, 1 ],
	[ 0, -1 ],
	[ 0, 1 ],
	[ 1, -1 ],
	[ 1, 0 ],
	[ 1, 1 ],
];
