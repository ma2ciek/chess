import Chessboard from '../Chessboard';
import { CommonMove, FigureTypes, isCorrectPosition, JSONFigure, Move } from '../utils';

abstract class ChessFigure {
    public readonly abstract type: FigureTypes;
    public abstract get shortName(): string;

    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly color: number,
    ) { }

    public toString() {
        const humanColor = this.color === 0 ? 'White' : 'Black';

        return humanColor + ' ' + this.type + ', ' + this.getHumanPosition();
    }

    public abstract getPossibleMoves( chessboard: Chessboard ): Move[];

    // TODO: Move.
    public getHumanPosition() {
        const charCodeA = 'A'.charCodeAt( 0 );
        const humanX = String.fromCharCode( charCodeA + this.x );
        const humanY = ( this.y + 1 ).toString();

        return humanX + humanY;
    }

    public toJSON(): JSONFigure {
        return { x: this.x, y: this.y, type: this.type, color: this.color };
    }

    protected getMovesInDirection( chessboard: Chessboard, dirX: number, dirY: number ) {
        let x = this.x;
        let y = this.y;

        const moves: CommonMove[] = [];

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

    protected getCommonMove( chessboard: Chessboard, x: number, y: number ): CommonMove | null {
        if ( !isCorrectPosition( x, y ) ) {
            return null;
        }

        if ( chessboard.isOpponentAt( x, y ) ) {
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
