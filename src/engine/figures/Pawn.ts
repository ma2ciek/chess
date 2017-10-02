import Chessboard from '../Chessboard';
import { FigureTypes, Move } from '../utils';
import ChessFigure from './ChessFigure';

interface IPawnMove extends Move {
    type: PawnMoveType;
}

export type PawnMoveType = 'long-move' | 'normal' | 'en-passant' | 'capture' | 'promotion-move' | 'promotion-capture';

export default class Pawn extends ChessFigure {
    public readonly type = FigureTypes.PAWN;

    public get shortName() {
        return this.color ? 'p' : 'P';
    }

    public getPossibleMoves( chessboard: Chessboard ) {
        const dir = chessboard.getTurnDir();
        const moves: IPawnMove[] = [];

        if ( this.isPromotionMove( dir ) ) {
            if ( chessboard.isEmptyAt( this.x, this.y + dir ) ) {
                moves.push( {
                    dest: { x: this.x, y: this.y + dir },
                    type: 'promotion-move',
                    figure: this,
                } );
            }

            if ( chessboard.isOpponentAt( this.x + 1, this.y + dir ) ) {
                moves.push( {
                    dest: { x: this.x + 1, y: this.y + dir },
                    type: 'promotion-capture',
                    figure: this,
                } );
            }

            if ( chessboard.isOpponentAt( this.x - 1, this.y + dir ) ) {
                moves.push( {
                    dest: { x: this.x - 1, y: this.y + dir },
                    type: 'promotion-capture',
                    figure: this,
                } );
            }

            return moves;
        }

        if ( this.isFirstMove( dir ) ) {
            if ( chessboard.isEmptyAt( this.x, this.y + dir ) ) {
                if ( chessboard.isEmptyAt( this.x, this.y + dir * 2 ) ) {
                    moves.push( {
                        dest: { x: this.x, y: this.y + dir * 2 },
                        type: 'long-move',
                        figure: this,
                    } );
                }
            }
        } else {
            const lastMove = chessboard.getLastMove();
            if (
                lastMove.type === 'long-move' &&
                lastMove.dest.x === this.x - 1 && lastMove.dest.y === this.y
            ) {
                moves.push( {
                    dest: { x: this.x - 1, y: this.y + dir },
                    type: 'en-passant',
                    figure: this,
                } );
            }

            if (
                lastMove.type === 'long-move' &&
                lastMove.dest.x === this.x + 1 && lastMove.dest.y === this.y
            ) {
                moves.push( {
                    dest: { x: this.x + 1, y: this.y + dir },
                    type: 'en-passant',
                    figure: this,
                } );
            }
        }

        if ( chessboard.isEmptyAt( this.x, this.y + dir ) ) {
            moves.push( {
                dest: { x: this.x, y: this.y + dir },
                type: 'normal',
                figure: this,
            } );
        }

        if ( chessboard.isOpponentAt( this.x + 1, this.y + dir ) ) {
            moves.push( {
                dest: { x: this.x + 1, y: this.y + dir },
                type: 'capture',
                figure: this,
            } );
        }

        if ( chessboard.isOpponentAt( this.x - 1, this.y + dir ) ) {
            moves.push( {
                dest: { x: this.x - 1, y: this.y + dir },
                type: 'capture',
                figure: this,
            } );
        }

        return moves;
    }

    private isFirstMove( dir: number ) {
        return dir === 1 && this.y === 1 || dir === -1 && this.y === 6;
    }

    private isPromotionMove( dir: number ) {
        return dir === 1 && this.y === 6 || dir === -1 && this.y === 1;
    }
}
