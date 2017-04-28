import Chessboard from '../Chessboard';
import ChessFigure from './ChessFigure';

interface IPawnMove {
    x: number;
    y: number;
    type: PawnMoveType;
}

export type PawnMoveType = 'long-move' | 'normal-move' | 'en-passant' | 'capture' | 'promotion-move' | 'promotion-capture';

export default class Pawn extends ChessFigure {
	public readonly type: 'pawn' = 'pawn';

    public getAvailableMoves( chessboard: Chessboard ) {
        const dir = chessboard.getTurnDir();
        const moves: IPawnMove[] = [];

        if ( this.isPromotionMove( dir ) ) {
            if ( chessboard.isEmptyAt( this._x, this._y + dir ) ) {
                moves.push( { x: this._x, y: this._y + dir, type: 'promotion-move' } )
            }

            if ( chessboard.IsOpponentAt( this._x + 1, this._y + dir ) ) {
                moves.push( { x: this._x + 1, y: this._y + dir, type: 'promotion-capture' } );
            }

            if ( chessboard.IsOpponentAt( this._x - 1, this._y + dir ) ) {
                moves.push( { x: this._x - 1, y: this._y + dir, type: 'promotion-capture' } );
            }

            return moves;
        }

        if ( this.isFirstMove( dir ) ) {
            if ( chessboard.isEmptyAt( this._x, this._y + dir ) ) {
                if ( chessboard.isEmptyAt( this._x, this._y + dir * 2 ) ) {
                    moves.push( { x: this._x, y: this._y + dir * 2, type: 'long-move' } );
                }
            }
        } else {
            const lastMove = chessboard.getLastMove();
            if (
                lastMove.type === 'long-pawn' &&
                lastMove.x === this._x - 1 && lastMove.y === this._y
            ) {
                moves.push( { x: this._x - 1, y: this._y + dir, type: 'en-passant' } );
            }

            if (
                lastMove.type === 'long-pawn' &&
                lastMove.x === this._x + 1 && lastMove.y === this._y
            ) {
                moves.push( { x: this._x + 1, y: this._y + dir, type: 'en-passant' } );
            }
        }

        if ( chessboard.isEmptyAt( this._x, this._y + dir ) ) {
            moves.push( { x: this._x, y: this._y + dir, type: 'normal-move' } );
        }

        if ( chessboard.IsOpponentAt( this._x + 1, this._y + dir ) ) {
            moves.push( { x: this._x + 1, y: this._y + dir, type: 'capture' } );
        }

        if ( chessboard.IsOpponentAt( this._x - 1, this._y + dir ) ) {
            moves.push( { x: this._x - 1, y: this._y + dir, type: 'capture' } );
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
