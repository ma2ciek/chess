import Chessboard from '../Chessboard';
import MoveController from '../MoveController';
import { JSONFigure, Move } from '../utils';
import BoardValueEstimator from './BoardValueEstimator';
import { shuffle } from './utils';

// TODO - clear
const bve = new BoardValueEstimator();

self.onmessage = e => {
	const d = Date.now();
	console.log( d );
	const [ figures, historyMoves, board1moves ] = e.data as [ JSONFigure[], Move[], Move[] ];

	const board: Chessboard = Chessboard.fromJSON( figures, historyMoves );

	let bestValueForBoard2 = -Infinity;
	let bestMove: Move | null = null;
	let counted = 0;

	for ( const board1move of shuffle( board1moves ) ) {
		// After my move.
		const board2 = MoveController.applyMove( board, board1move );
		const board3s = board2.getAvailableBoards();
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

		for ( const board3 of shuffle( board3s ) ) {
			// After my move and opponent's move.

			if ( bve.includes( board3 ) ) {
				continue;
			}

			const board4s = board3.getAvailableBoards();

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

			for ( const board4 of shuffle( board4s ) ) {
				if ( bve.includes( board4 ) ) {
					continue;
				}

				// After my move and opponent's move.
				const board5s = board4.getAvailableBoards();

				// This should be initialized with higher value than the bestValueForBoard2.
				let worstValueForBoard5 = 1000;

				if ( board4.isCheckMate() ) {
					bestValueForBoard4 = 1000;
					break;
				}

				if ( board4.isDraw() ) {
					bestValueForBoard4 = 0;
					continue;
				}

				// No shuffle - speed up the last loop.
				for ( const board5 of board5s ) {
					// After my move and opponent's move and my second move.

					// Now is opponent's turn
					// TODO: something is wrong with the logic here.

					const board5value = bve.estimateValue( board5 );
					worstValueForBoard5 = Math.min( board5value, worstValueForBoard5 );
					counted++;
				}

				bestValueForBoard4 = Math.max( bestValueForBoard4, worstValueForBoard5 );
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

	( self as any ).postMessage( [ {
		bestMove,
		counted,
		bestMoveValue: bestValueForBoard2,
	}] );

	bve.clearAll();

	console.log( Date.now() - d );
};
