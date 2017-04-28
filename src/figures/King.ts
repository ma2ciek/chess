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
	public readonly type: 'king' = 'king';

	public getAvailableMoves( chessboard: Chessboard ): IKingMoves[] {
		const moves: IKingMoves[] = [];

		for ( const translation of availableKingTranslations ) {
			const x = this._x + translation[ 0 ];
			const y = this._y + translation[ 1 ];

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

const availableKingTranslations = [
	[ -1, -1 ],
	[ -1, 0 ],
	[ -1, 1 ],
	[ 0, -1 ],
	[ 0, 1 ],
	[ 1, -1 ],
	[ 1, 0 ],
	[ 1, 1 ],
];
