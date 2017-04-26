import Chessboard from '../Chessboard';
import { isCorrectPosition } from '../utils';
import ChessFigure from './ChessFigure';

interface IKingMoves {
	x: number;
	y: number;
	type: KingMoveType;
}

type KingMoveType = 'normal' | 'capture' | 'o-o' | 'o-o-o';

export default class King extends ChessFigure {
	public type: 'king' = 'king';

	public getAvailableMoves( chessboard: Chessboard ): IKingMoves[] {
		const moves: IKingMoves[] = [];

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

		// TODO: castles.

		return moves;
	}
}

const movesArray = [
	[ -1, -1 ],
	[ -1, 0 ],
	[ -1, 1 ],
	[ 0, -1 ],
	[ 0, 1 ],
	[ 1, -1 ],
	[ 1, 0 ],
	[ 1, 1 ],
];
