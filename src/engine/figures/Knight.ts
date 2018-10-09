import Chessboard from '../Chessboard';
import { FigureTypes, isCorrectPosition, Move, MoveTypes } from '../utils';
import ChessFigure from './ChessFigure';

export default class Knight extends ChessFigure {
	public readonly type = FigureTypes.KNIGHT;

	public get shortName() {
		return this.color ? 'n' : 'N';
	}

	public getPossibleMoves( chessboard: Chessboard ): Move[] {
		const moves: Move[] = [];

		for ( const move of movesArray ) {
			const x = this.x + move[ 0 ];
			const y = this.y + move[ 1 ];

			if ( !isCorrectPosition( x, y ) ) {
				continue;
			}

			if ( chessboard.isEmptyAt( x, y ) ) {
				moves.push( {
					dest: { x, y },
					type: MoveTypes.NORMAL,
					figure: this,
				} );
			} else if ( chessboard.isOpponentAt( x, y ) ) {
				moves.push( {
					dest: { x, y },
					type: MoveTypes.CAPTURE,
					figure: this,
				} );
			}
		}

		return moves;
	}
}

const movesArray: ReadonlyArray<ReadonlyArray<number>> = [
	[ 1, 2 ],
	[ 1, -2 ],
	[ 2, -1 ],
	[ 2, 1 ],
	[ -1, -2 ],
	[ -1, 2 ],
	[ -2, -1 ],
	[ -2, 1 ],
];
