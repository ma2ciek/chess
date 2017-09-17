import Chessboard from '../Chessboard';
import MoveController from '../MoveController';
import { IMove, isCorrectPosition } from '../utils';
import ChessFigure from './ChessFigure';

interface IKingMoves extends IMove {
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
				moves.push( {
					dest: { x, y },
					type: 'normal',
					figure: this,
				} );
			} else if ( chessboard.IsOpponentAt( x, y ) ) {
				moves.push( {
					dest: { x, y },
					type: 'capture',
					figure: this,
				} );
			}
		}

		const myMoves = chessboard.history.getMyMoves();

		if ( myMoves.some( move => move.figure.type === 'king' ) ) {
			return moves;
		}

		const castleQueenSide = this.castleQueenSide( chessboard );
		const castleKingSide = this.castleKingSide( chessboard );

		return [
			...moves,
			castleQueenSide,
			castleKingSide,
		].filter( x => !!x );
	}

	private castleQueenSide( chessboard: Chessboard ): IKingMoves {
		const row = this.color === 0 ? 0 : 7;
		const aFigure = chessboard.getFigureFrom( 0, row );

		if (
			chessboard.isEmptyAt( 1, row ) &&
			chessboard.isEmptyAt( 2, row ) &&
			chessboard.isEmptyAt( 3, row ) &&
			!!aFigure &&
			aFigure.type === 'rook'
		) {
			const move: IKingMoves = {
				dest: { x: 2, y: row },
				type: 'o-o-o',
				figure: this,
			};

			const cb = new MoveController().applyMove( chessboard, move );
			const pMoves = cb.getPossibleMoves();

			const isUnderCheck = pMoves.some( m => {
				return (
					m.dest.x === 2 && m.dest.y === row ||
					m.dest.x === 3 && m.dest.y === row
				);
			} );

			if ( !isUnderCheck ) {
				return move;
			}
		}

		return null;
	}

	private castleKingSide( chessboard: Chessboard ): IKingMoves {
		const row = this.color === 0 ? 0 : 7;
		const hFigure = chessboard.getFigureFrom( 7, row );

		if (
			chessboard.isEmptyAt( 5, row ) &&
			chessboard.isEmptyAt( 6, row ) &&
			!!hFigure &&
			hFigure.type === 'rook'
		) {
			const move: IKingMoves = {
				dest: { x: 6, y: row },
				type: 'o-o',
				figure: this,
			};

			const cb = new MoveController().applyMove( chessboard, move );
			const pMoves = cb.getPossibleMoves();

			const isUnderCheck = pMoves.some( m => {
				return (
					m.dest.x === 5 && m.dest.y === row ||
					m.dest.x === 6 && m.dest.y === row
				);
			} );

			if ( !isUnderCheck ) {
				return move;
			}
		}

		return null;
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
