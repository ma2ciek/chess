import Chessboard from '../Chessboard';
import { Move, Vector, MoveTypes, JSONFigure } from '../utils';
import AIPlayer, { MoveInfo } from './AIPlayer';

export default abstract class MultiThreadPlayer extends AIPlayer {
	protected abstract readonly workerName: string;

	private readonly numberOfThreads = window.navigator.hardwareConcurrency || 4;
	private workers?: ReadonlyArray<Worker>;

	public destroy() {
		if ( this.workers ) {
			this.workers.forEach( w => w.terminate() );
			this.workers = [];
		}
	}

	protected async _move( board: Chessboard ): Promise<MoveInfo> {
		if ( !this.workers ) {
			this.initializeWorkers();
		}

		const board1moves = board.getAvailableMoves();
		const movesPerThread = board1moves.length / this.numberOfThreads;
		const moves: Move[][] = [];

		let currentThreadIndex = 0;

		for ( let i = 0; i < board1moves.length; i++ ) {
			if ( i >= ( currentThreadIndex + 1 ) * movesPerThread ) {
				currentThreadIndex++;
			}

			if ( !moves[ currentThreadIndex ] ) {
				moves[ currentThreadIndex ] = [];
			}

			moves[ currentThreadIndex ].push( board1moves[ i ] );
		}

		// TODO: Move some optimizations outside of the main script.
		const minifiedFigures = board.figures.map( f =>
			f.color | // 0. bit
			( f.x << 1 ) | // 1-3 bits
			( f.y << 4 ) | // 4-6 bits
			( f.type << 7 ) // 7-9 bits
		);

		const outputs = await Promise.all(
			moves.map( ( movesForThread, workerIndex ) => {
				return new Promise<MoveInfo>( res => {
					const worker = this.workers![ workerIndex ];

					const moves: ParsedMove[] = movesForThread.map( move => ( {
						figureId: board.figures.findIndex( f => {
							return (
								f.x === move.figure.x &&
								f.y === move.figure.y
							);
						} ),
						dest: move.dest,
						type: move.type
					} ) );

					worker.postMessage( [
						minifiedFigures,
						moves,
					] );

					worker.onmessage = e => {
						res( e.data[ 0 ] as MoveInfo );
					};
				} );
			} ),
		);

		let bestMoveValue = -Infinity;
		let bestMove: Move | null = null;
		let counted = 0;

		for ( const output of outputs ) {
			if ( bestMoveValue < output.bestMoveValue ) {
				bestMove = output.bestMove;
				bestMoveValue = output.bestMoveValue;
			}

			counted += output.counted;
		}

		return { bestMove, bestMoveValue, counted };
	}

	private initializeWorkers() {
		const workers = [];

		for ( let i = 0; i < this.numberOfThreads; i++ ) {
			workers.push( new Worker( 'public/' + this.workerName ) );
		}

		this.workers = workers;
	}
}

export interface ParsedMove {
	figureId: number;
	dest: Vector;
	type: MoveTypes;
}

export function parseData( data: [ number[], ParsedMove[] ] ) {
	const figures = toFigures( data[ 0 ] );
	const moves = toMoves( data[ 1 ], figures );

	return {
		figures,
		moves,
	};
}

export function toFigures( figures: number[] ): JSONFigure[] {
	return figures.map( figure => ( {
		color: figure & 1,
		x: ( figure >> 1 ) & 7,
		y: ( figure >> 4 ) & 7,
		type: ( figure >> 7 ) & 7,
	} ) )
}

export function toMoves( moves: ParsedMove[], figures: JSONFigure[] ): Move[] {
	return moves.map( move => ( {
		figure: figures[ move.figureId ],
		dest: move.dest,
		type: move.type
	} ) )
}
