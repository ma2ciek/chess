import { isCurrentPlayerCheckmated, isDraw } from '../board-utils';
import Chessboard from '../Chessboard';
import MoveController from '../MoveController';
import { Move } from '../utils';
import AIPlayer, { MoveInfo } from './AIPlayer';
import BoardValueEstimator from './BoardValueEstimator';

export default class SimpleAIPlayer extends AIPlayer {
	public static readonly playerName  = 'AI: Simple Player';

	private bve = new BoardValueEstimator();

	public destroy() {
		this.bve.clearAll();
	}

	public async _move( board: Chessboard, initialMoves = board.getAvailableMoves() ): Promise<MoveInfo> {
		let bestValueForBoard2 = -Infinity;
		let bestMove: Move | null = null;
		let counted = 0;

		this.bve.clear();

		for ( const board1move of initialMoves ) {
			// After my move.
			const board2 = MoveController.applyMove( board, board1move );
			const board2moves = board2.getPossibleMoves();
			let worstValueForBoard3 = 1000;

			// To expensive. It needs to be investigated what we need.
			if ( isCurrentPlayerCheckmated( board2 ) ) {
				bestValueForBoard2 = 1000;
				bestMove = board1move;
				break;
			}

			if ( isDraw( board2 ) ) {
				worstValueForBoard3 = 0;
				if ( bestValueForBoard2 < worstValueForBoard3 ) {
					bestValueForBoard2 = worstValueForBoard3;
					bestMove = board1move;
				}
				continue;
			}

			for ( const board2move of board2moves ) {
				// After my move and opponent's move.
				const board3 = MoveController.applyMove( board2, board2move );
				const board3moves = board3.getPossibleMoves();

				// This should be initialized with higher value than the bestValueForBoard2.
				let bestValueForBoard4 = -1000;

				// if ( isCurrentPlayerCheckmated( board3 ) ) {
				// 	worstValueForBoard3 = -1000;
				// 	break;
				// }

				if ( isDraw( board3 ) ) {
					worstValueForBoard3 = 0;
					continue;
				}

				for ( const board3move of board3moves ) {
					// After my move and opponent's move and my second move.
					const board4 = MoveController.applyMove( board3, board3move );

					const board4value = -this.bve.estimateValue( board4 );
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
			bestMoveValue: bestValueForBoard2,
		};
	}

}
