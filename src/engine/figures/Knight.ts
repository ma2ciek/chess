import Chessboard from '../Chessboard';
import { isCorrectPosition, Move } from '../utils';
import ChessFigure from './ChessFigure';

interface IKnightMove extends Move {
	type: KnightMoveType;
}

export type KnightMoveType = 'normal' | 'capture';

export default class Knight extends ChessFigure {
	public readonly type: 'knight' = 'knight';

	public getPossibleMoves( chessboard: Chessboard ): IKnightMove[] {
		const moves: IKnightMove[] = [];

		for ( const move of movesArray ) {
			const x = this.x + move[ 0 ];
			const y = this.y + move[ 1 ];

			if ( !isCorrectPosition( x, y ) ) {
				continue;
			}

			if ( chessboard.isEmptyAt( x, y ) ) {
				moves.push( {
					dest: { x, y },
					type: 'normal',
					figure: this,
				} );
			} else if ( chessboard.isOpponentAt( x, y ) ) {
				moves.push( {
					dest: { x, y },
					type: 'capture',
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
