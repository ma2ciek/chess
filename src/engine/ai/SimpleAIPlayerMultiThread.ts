import Chessboard from '../Chessboard';
import getMoveSymbol from '../getMoveSymbol';
import IPlayer from '../IPlayer';
import { Move } from '../utils';

export default class SimpleAIPlayerMultiThread implements IPlayer {
	public static readonly workerName = 'SimpleAIPlayerWorker.js';

	private readonly numberOfThreads = window.navigator.hardwareConcurrency || 4;
	private readonly workers: Worker[] = [];

	constructor() {
		for ( let i = 0; i < this.numberOfThreads; i++ ) {
			this.workers[ i ] = new Worker( 'build/' + ( this.constructor as typeof SimpleAIPlayerMultiThread ).workerName );
		}
	}

	public isHuman() {
		return false;
	}

	public destroy() {
		this.workers.forEach( w => w.terminate() );
	}

	public async move( board: Chessboard ): Promise<Move> {
		const d = Date.now();

		const { bestMove, counted } = await this.moveSimultaneously( board );

		if ( !bestMove ) {
			debugger;
			throw new Error( 'Can not find any move for this position' );
		}

		const timeDiff = Date.now() - d;

		console.log( Math.round( counted / timeDiff * 1000 ) + ' moves/s', getMoveSymbol( bestMove ) );

		return bestMove;
	}

	private async moveSimultaneously( board: Chessboard ): Promise<MoveInfo> {
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
}

type MoveInfo = Readonly<{
	bestMove: Move | null;
	counted: number;
	bestMoveValue: number;
}>;
