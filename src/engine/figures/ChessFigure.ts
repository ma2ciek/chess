import Chessboard from '../Chessboard';
import { FigureTypes, JSONFigure, Move, MoveTypes } from '../utils';

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

        const moves: Move[] = [];

        while ( true ) {
            x += dirX;
            y += dirY;

            if ( x < 0 || y < 0 || x > 7 || y > 7 ) {
                break;
            }

            const f = chessboard.board.rawBoard[ y * 8 + x ];

            if ( f ) {
                // Opponent found.
                if ( f.color !== chessboard.turnColor ) {
                    moves.push( {
                        dest: { x, y },
                        type: MoveTypes.CAPTURE,
                        figure: this,
                    } );
                }

                break;
            }

            moves.push( {
                dest: { x, y },
                type: MoveTypes.NORMAL,
                figure: this,
            } );
        }

        return moves;
    }
}

export default ChessFigure;
