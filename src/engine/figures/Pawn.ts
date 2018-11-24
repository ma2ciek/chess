import Chessboard from '../Chessboard';
import { FigureTypes, Move, MoveTypes } from '../utils';
import ChessFigure from './ChessFigure';

export default class Pawn extends ChessFigure {
	public readonly type = FigureTypes.PAWN;

	public get shortName() {
		return this.color ? 'p' : 'P';
	}

	public getPossibleMoves( chessboard: Chessboard ) {
		const dir = chessboard.getTurnDir();
		const moves: Move[] = [];

		if ( this.isFirstMove( dir ) ) {
			if ( chessboard.isEmptyAt( this.x, this.y + dir ) ) {
				moves.push( {
					dest: { x: this.x, y: this.y + dir },
					type: MoveTypes.NORMAL,
					figure: this,
				} );

				if ( chessboard.isEmptyAt( this.x, this.y + dir * 2 ) ) {
					moves.push( {
						dest: { x: this.x, y: this.y + dir * 2 },
						type: MoveTypes.LONG_MOVE,
						figure: this,
					} );
				}
			}
		} else {
			if ( chessboard.enPassantMove && chessboard.enPassantMove.y === this.y + dir ) {
				if ( chessboard.enPassantMove.x === this.x - 1 ) {
					moves.push( {
						dest: { x: this.x - 1, y: this.y + dir },
						type: MoveTypes.EN_PASSANT,
						figure: this,
					} );
				} else if ( chessboard.enPassantMove.x === this.x + 1 ) {
					moves.push( {
						dest: { x: this.x + 1, y: this.y + dir },
						type: MoveTypes.EN_PASSANT,
						figure: this,
					} );
				}
			}

			if ( this.isPromotionMove( dir ) ) {
				if ( chessboard.isEmptyAt( this.x, this.y + dir ) ) {
					moves.push( {
						dest: { x: this.x, y: this.y + dir },
						type: MoveTypes.PROMOTION,
						figure: this,
					} );
				}

				if ( this.x < 7 && chessboard.isOpponentAt( this.x + 1, this.y + dir ) ) {
					moves.push( {
						dest: { x: this.x + 1, y: this.y + dir },
						type: MoveTypes.PROMOTION_CAPTURE,
						figure: this,
					} );
				}

				if ( this.x > 0 && chessboard.isOpponentAt( this.x - 1, this.y + dir ) ) {
					moves.push( {
						dest: { x: this.x - 1, y: this.y + dir },
						type: MoveTypes.PROMOTION_CAPTURE,
						figure: this,
					} );
				}

				return moves;
			}

			if ( chessboard.isEmptyAt( this.x, this.y + dir ) ) {
				moves.push( {
					dest: { x: this.x, y: this.y + dir },
					type: MoveTypes.NORMAL,
					figure: this,
				} );
			}
		}

		if ( !this.isPromotionMove( dir ) ) {
			if ( this.x < 7 && chessboard.isOpponentAt( this.x + 1, this.y + dir ) ) {
				moves.push( {
					dest: { x: this.x + 1, y: this.y + dir },
					type: MoveTypes.CAPTURE,
					figure: this,
				} );
			}

			if ( this.x > 0 && chessboard.isOpponentAt( this.x - 1, this.y + dir ) ) {
				moves.push( {
					dest: { x: this.x - 1, y: this.y + dir },
					type: MoveTypes.CAPTURE,
					figure: this,
				} );
			}
		}

		return moves;
	}

	private isFirstMove( dir: number ) {
		return dir === 1 ? this.y === 1 : this.y === 6;
	}

	private isPromotionMove( dir: number ) {
		return dir === 1 ? this.y === 6 : this.y === 1;
	}
}
