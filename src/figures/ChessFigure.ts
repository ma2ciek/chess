import Chessboard from '../Chessboard';
import { ICommonMove, isCorrectPosition } from '../utils';

interface IMove {
    x: number;
    y: number;
    type: string;
}

abstract class ChessFigure {
    public abstract type: 'king' | 'knight' | 'pawn' | 'queen' | 'rook' | 'bishop';

    constructor(
        protected _x: number,
        protected _y: number,
        protected _color: number,
    ) { }

    public abstract getAvailableMoves( chessboard: Chessboard ): IMove[];

    public get x() {
        return this._x;
    }

    public get y() {
        return this._y;
    }

    public get color() {
        return this._color;
    }

    public moveTo( x: number, y: number ) {
        this._x = x;
        this._y = y;
    }

    public toJSON() {
        return { x: this._x, y: this._y, type: this.type, color: this._color };
    }

    protected getMovesInDirection( chessboard: Chessboard, dirX: number, dirY: number ) {
        let x = this._x;
        let y = this._y;

        const moves: ICommonMove[] = [];

        while ( true ) {
            x += dirX;
            y += dirY;

            const move = this.getCommonMove( chessboard, x, y );

            if ( !move ) {
                break;
            }

            moves.push( move );

            if ( move.type === 'capture' ) {
                break;
            }
        }

        return moves;
    }

    protected getCommonMove( chessboard: Chessboard, x: number, y: number ): ICommonMove {
        if ( !isCorrectPosition( x, y ) ) {
            return null;
        }

        if ( chessboard.IsOpponentAt( x, y ) ) {
            return { x, y, type: 'capture' };
        }

        if ( !chessboard.isEmptyAt( x, y ) ) {
            return null;
        }

        return { x, y, type: 'normal-move' };
    }
}

export default ChessFigure;
