import Chessboard from '../Chessboard';
import { ICommonMove, IMove, isCorrectPosition, JSONFigure } from '../utils';

abstract class ChessFigure {
    public readonly abstract type: 'king' | 'knight' | 'pawn' | 'queen' | 'rook' | 'bishop';

    constructor(
        protected _x: number,
        protected _y: number,
        protected _color: number,
    ) { }

    public toString() {
        const humanColor = this.color === 0 ? 'White' : 'Black';

        return humanColor + ' ' + this.type + ', ' + this.getHumanPosition();
    }

    public abstract getAvailableMoves( chessboard: Chessboard ): IMove[];

    // TODO: Move.
    public getHumanPosition() {
        const charCodeA = 'A'.charCodeAt( 0 );
        const humanX = String.fromCharCode( charCodeA + this._x );
        const humanY = ( this._y + 1 ).toString();

        return humanX + humanY;
    }

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

    public toJSON(): JSONFigure {
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
            return {
                dest: { x, y },
                type: 'capture',
                figure: this,
            };
        }

        if ( !chessboard.isEmptyAt( x, y ) ) {
            return null;
        }

        return {
            dest: { x, y },
            type: 'normal',
            figure: this,
        };
    }
}

export default ChessFigure;
