import Chessboard from '../Chessboard';
import { isCorrectPosition } from '../utils';
import ChessFigure from './ChessFigure';

interface IKnightMove {
	x: number;
	y: number;
	type: KnightMoveType;
}

export type KnightMoveType = 'normal' | 'capture';

export default class Knight extends ChessFigure {
	public readonly type: 'knight' = 'knight';

	public getAvailableMoves( chessboard: Chessboard ): IKnightMove[] {
		const moves: IKnightMove[] = [];

		for ( const move of movesArray ) {
			const x = this._x + move[ 0 ];
			const y = this._y + move[ 1 ];

			if ( !isCorrectPosition( x, y ) ) {
				continue;
			}

			if ( chessboard.isEmptyAt( x, y ) ) {
				moves.push( { x, y, type: 'normal' } );
			} else if ( chessboard.IsOpponentAt( x, y ) ) {
				moves.push( { x, y, type: 'capture' } );
			}
		}

		return moves;
	}
}

const movesArray = [
	[ 1, 2 ],
	[ 1, -2 ],
	[ 2, -1 ],
	[ 2, 1 ],
	[ -1, -2 ],
	[ -1, 2 ],
	[ -2, -1 ],
	[ -2, 1 ],
];
