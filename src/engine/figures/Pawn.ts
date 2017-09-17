import Chessboard from '../Chessboard';
import { IMove } from '../utils';
import ChessFigure from './ChessFigure';

interface IPawnMove extends IMove {
    type: PawnMoveType;
}

export type PawnMoveType = 'long-move' | 'normal' | 'en-passant' | 'capture' | 'promotion-move' | 'promotion-capture';

export default class Pawn extends ChessFigure {
    public readonly type: 'pawn' = 'pawn';

    public getAvailableMoves( chessboard: Chessboard ) {
        const dir = chessboard.getTurnDir();
        const moves: IPawnMove[] = [];

        if ( this.isPromotionMove( dir ) ) {
            if ( chessboard.isEmptyAt( this._x, this._y + dir ) ) {
                moves.push( {
                    dest: { x: this._x, y: this._y + dir },
                    type: 'promotion-move',
                    figure: this,
                } );
            }

            if ( chessboard.IsOpponentAt( this._x + 1, this._y + dir ) ) {
                moves.push( {
                    dest: { x: this._x + 1, y: this._y + dir },
                    type: 'promotion-capture',
                    figure: this,
                } );
            }

            if ( chessboard.IsOpponentAt( this._x - 1, this._y + dir ) ) {
                moves.push( {
                    dest: { x: this._x - 1, y: this._y + dir },
                    type: 'promotion-capture',
                    figure: this,
                } );
            }

            return moves;
        }

        if ( this.isFirstMove( dir ) ) {
            if ( chessboard.isEmptyAt( this._x, this._y + dir ) ) {
                if ( chessboard.isEmptyAt( this._x, this._y + dir * 2 ) ) {
                    moves.push( {
                        dest: { x: this._x, y: this._y + dir * 2 },
                        type: 'long-move',
                        figure: this,
                    } );
                }
            }
        } else {
            const lastMove = chessboard.getLastMove();
            if (
                lastMove.type === 'long-move' &&
                lastMove.dest.x === this._x - 1 && lastMove.dest.y === this._y
            ) {
                moves.push( {
                    dest: { x: this._x - 1, y: this._y + dir },
                    type: 'en-passant',
                    figure: this,
                } );
            }

            if (
                lastMove.type === 'long-move' &&
                lastMove.dest.x === this._x + 1 && lastMove.dest.y === this._y
            ) {
                moves.push( {
                    dest: { x: this._x + 1, y: this._y + dir },
                    type: 'en-passant',
                    figure: this,
                } );
            }
        }

        if ( chessboard.isEmptyAt( this._x, this._y + dir ) ) {
            moves.push( {
                dest: { x: this._x, y: this._y + dir },
                type: 'normal',
                figure: this,
            } );
        }

        if ( chessboard.IsOpponentAt( this._x + 1, this._y + dir ) ) {
            moves.push( {
                dest: { x: this._x + 1, y: this._y + dir },
                type: 'capture',
                figure: this,
            } );
        }

        if ( chessboard.IsOpponentAt( this._x - 1, this._y + dir ) ) {
            moves.push( {
                dest: { x: this._x - 1, y: this._y + dir },
                type: 'capture',
                figure: this,
            } );
        }

        return moves;
    }

    private isFirstMove( dir: number ) {
        return dir === 1 && this._y === 1 || dir === -1 && this._y === 6;
    }

    private isPromotionMove( dir: number ) {
        return dir === 1 && this._y === 6 || dir === -1 && this._y === 1;
    }
}
