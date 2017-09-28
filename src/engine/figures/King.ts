import Chessboard from '../Chessboard';
import MoveController from '../MoveController';
import { isCorrectPosition, Move } from '../utils';
import ChessFigure from './ChessFigure';

interface KingMove extends Move {
	type: KingMoveType;
}

type KingMoveType = 'normal' | 'capture' | 'o-o' | 'o-o-o';

export default class King extends ChessFigure {
	public readonly type: 'king' = 'king';

	public getPossibleMoves( chessboard: Chessboard ): KingMove[] {
		const moves: KingMove[] = [];

		for ( const translation of availableKingTranslations ) {
			const x = this.x + translation[ 0 ];
			const y = this.y + translation[ 1 ];

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

		const row = this.color === 0 ? 0 : 7;
		const myMoves = chessboard.history.getMyMoves();
		const figureAtKingPosition = chessboard.getFigureFrom( 4, row );

		if (
			myMoves.some( move => move.figure.type === 'king' ) ||
			!figureAtKingPosition ||
			figureAtKingPosition.type !== 'king'
		) {
			return moves;
		}

		const castleQueenSide = this.castleQueenSide( chessboard );
		const castleKingSide = this.castleKingSide( chessboard );

		const kingMoves = [
			...moves,
			castleQueenSide,
			castleKingSide,
		];

		return kingMoves.filter( move => !!move ) as KingMove[];
	}

	private castleQueenSide( chessboard: Chessboard ): KingMove | null {
		const row = this.color === 0 ? 0 : 7;

		const aRookMoved = chessboard.history.moves.some( m => {
			return (
				m.figure.type === 'rook' &&
				m.figure.color === this.color &&
				m.figure.x === 0 &&
				m.figure.y === row
			);
		} );

		const figureAtFirstCol = chessboard.getFigureFrom( 0, row );

		if (
			chessboard.isEmptyAt( 1, row ) &&
			chessboard.isEmptyAt( 2, row ) &&
			chessboard.isEmptyAt( 3, row ) &&
			!aRookMoved &&
			figureAtFirstCol &&
			figureAtFirstCol.type === 'rook'
		) {
			const move: KingMove = {
				dest: { x: 2, y: row },
				type: 'o-o-o',
				figure: this,
			};

			const cb = new MoveController().applyMove( chessboard, move );
			const pMoves = cb.getPossibleMoves();

			const isUnderCheck = pMoves.some( m => {
				return (
					m.dest.x === 2 && m.dest.y === row ||
					m.dest.x === 3 && m.dest.y === row ||
					m.dest.x === 4 && m.dest.y === row
				);
			} );

			if ( !isUnderCheck ) {
				return move;
			}
		}

		return null;
	}

	private castleKingSide( chessboard: Chessboard ): KingMove | null {
		const row = this.color === 0 ? 0 : 7;
		const history = chessboard.history;

		const hRookMoved = history.moves.some( m => {
			return (
				m.figure.type === 'rook' &&
				m.figure.color === this.color &&
				m.figure.x === 7 &&
				m.figure.y === row
			);
		} );

		const figureAtLastCol = chessboard.getFigureFrom( 7, row );

		if (
			chessboard.isEmptyAt( 5, row ) &&
			chessboard.isEmptyAt( 6, row ) &&
			!hRookMoved &&
			figureAtLastCol &&
			figureAtLastCol.type === 'rook'
		) {
			const move: KingMove = {
				dest: { x: 6, y: row },
				type: 'o-o',
				figure: this,
			};

			const cb = new MoveController().applyMove( chessboard, move );
			const pMoves = cb.getPossibleMoves();

			const isUnderCheck = pMoves.some( m => {
				return (
					m.dest.x === 4 && m.dest.y === row ||
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

const availableKingTranslations: ReadonlyArray<ReadonlyArray<number>> = [
	[ -1, -1 ],
	[ -1, 0 ],
	[ -1, 1 ],
	[ 0, -1 ],
	[ 0, 1 ],
	[ 1, -1 ],
	[ 1, 0 ],
	[ 1, 1 ],
];
