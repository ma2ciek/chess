import Chessboard from '../Chessboard';
import { Move } from '../utils';
import AIPlayer, { MoveInfo } from './AIPlayer';

export default abstract class MultiThreadPlayer extends AIPlayer {
	protected abstract readonly workerName: string;

	private readonly numberOfThreads = window.navigator.hardwareConcurrency || 4;
	private workers: ReadonlyArray<Worker>;

	public destroy() {
		if ( this.workers ) {
			this.workers.forEach( w => w.terminate() );
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

			const movesForThread = moves[ currentThreadIndex ];

			movesForThread.push( board1moves[ i ] );
		}

		const outputs = await Promise.all(
			moves.map( ( movesForThread, workerIndex ) => {
				return new Promise<MoveInfo>( res => {
					const worker = this.workers[ workerIndex ];

					worker.postMessage( [
						board.figures.map( f => f.toJSON() ),
						board.history.moves,
						movesForThread,
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
			if ( output.bestMoveValue >= bestMoveValue ) {
				bestMove = output.bestMove;
				bestMoveValue = output.bestMoveValue;
				counted += output.counted;
			}
		}

		return { bestMove, bestMoveValue, counted };
	}

	private initializeWorkers() {
		const workers = [];
		for ( let i = 0; i < this.numberOfThreads; i++ ) {
			workers.push( new Worker( 'build/' + this.workerName ) );
		}
		this.workers = workers;
	}
}
