import Chessboard from '../Chessboard';
import { FigureTypes, JSONFigure, Move, MoveTypes } from '../utils';

abstract class ChessFigure {
	public readonly abstract type: FigureTypes;
	public abstract get shortName(): string;

	constructor(
		public readonly x: number,
		public readonly y: number,

		/**
		 * White -> 0;
		 * Black -> 1;
		 */
		public readonly color: 0 | 1,
	) { }

	public abstract getPossibleMoves( chessboard: Chessboard ): Move[];

	public toJSON(): JSONFigure {
		return { x: this.x, y: this.y, type: this.type, color: this.color };
	}

	protected getMovesInDirections( chessboard: Chessboard, arr: ReadonlyArray<ReadonlyArray<number>> ) {
		let moves: Move[] = [];

		for ( const dir of arr ) {
			moves = moves.concat( this.getMovesInDirection( chessboard, dir[ 0 ], dir[ 1 ] ) );
		}

		return moves;
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

			const f = chessboard.getFigureFrom( x, y );

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
