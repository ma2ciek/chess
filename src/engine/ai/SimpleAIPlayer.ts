import Chessboard from '../Chessboard';
import getMoveSymbol from '../getMoveSymbol';
import IPlayer from '../IPlayer';
import MoveController from '../MoveController';
import { Move } from '../utils';
import estimateBoardValue from './estimateBoardValue';
import { shuffle, wait } from './utils';

export default class SimpleAIPlayer implements IPlayer {
	public isHuman() {
		return false;
	}

	public move( board: Chessboard ): Promise<Move> {
		// make it async to do not kill the UI.
		return wait( 0 ).then( () => {
			const d = Date.now();

			const { bestMove, counted } = this.moveSync( board );

			if ( !bestMove ) {
				debugger;
				throw new Error( 'Can not find any move for this position' );
			}

			const timeDiff = Date.now() - d;

			console.log( Math.round( counted / timeDiff * 1000 ) + ' moves/s', getMoveSymbol( bestMove ) );

			// Prevent moving too fast.
			const waitingTime = Math.max( 0, 500 - 1000 * timeDiff );
			return wait( waitingTime ).then( () => bestMove );
		} );
	}

	private moveSync( board: Chessboard ): Readonly<{ bestMove: Move | null, counted: number }> {
		const board1moves = board.getAvailableMoves();
		const mc = new MoveController();
		let bestValueForBoard2 = -Infinity;
		let bestMove: Move | null = null;
		let counted = 0;

		for ( const board1move of shuffle( board1moves ) ) {
			// After my move.
			const board2 = mc.applyMove( board, board1move );
			const board2moves = board2.getAvailableMoves();
			let worstValueForBoard3 = 1000;

			if ( board2.isCheckMate() ) {
				bestValueForBoard2 = 1000;
				bestMove = board1move;
				break;
			}

			if ( board2.isDraw() ) {
				worstValueForBoard3 = 0;
				if ( bestValueForBoard2 < worstValueForBoard3 ) {
					bestValueForBoard2 = worstValueForBoard3;
					bestMove = board1move;
				}
				continue;
			}

			for ( const board2move of shuffle( board2moves ) ) {
				// After my move and opponent's move.
				const board3 = mc.applyMove( board2, board2move );
				const board3moves = board3.getAvailableMoves();

				// This should be initialized with higher value than the bestValueForBoard2.
				let bestValueForBoard4 = -1000;

				if ( board3.isCheckMate() ) {
					worstValueForBoard3 = -1000;
					break;
				}

				if ( board3.isDraw() ) {
					worstValueForBoard3 = 0;
					continue;
				}

				for ( const board3move of shuffle( board3moves ) ) {
					// After my move and opponent's move and my second move.
					const board4 = mc.applyMove( board3, board3move );

					// Now is opponent's turn
					// TODO - something is wrong with the logic here.

					const board4value = estimateBoardValue( board4, board3move, board.turnColor );
					bestValueForBoard4 = Math.max( board4value, bestValueForBoard4 );
					counted++;
				}

				worstValueForBoard3 = Math.min( bestValueForBoard4, worstValueForBoard3 );
				counted++;
			}

			if ( bestValueForBoard2 < worstValueForBoard3 ) {
				bestValueForBoard2 = worstValueForBoard3;
				bestMove = board1move;
			}

			counted++;
		}

		return {
			bestMove,
			counted,
		};
	}
}
