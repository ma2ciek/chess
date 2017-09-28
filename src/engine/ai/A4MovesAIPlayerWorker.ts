import Chessboard from '../Chessboard';
import MoveController from '../MoveController';
import { JSONFigure, Move } from '../utils';
import estimateBoardValue from './estimateBoardValue';
import { shuffle } from './utils';

self.onmessage = e => {
	const [ figures, historyMoves, board1moves ] = e.data as [ JSONFigure[], Move[], Move[] ];

	const board: Chessboard = new Chessboard( figures, historyMoves );

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
				// After my move and opponent's move.
				const board4 = mc.applyMove( board3, board3move );
				const board4moves = board4.getAvailableMoves();

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

				for ( const board4move of shuffle( board4moves ) ) {
					// After my move and opponent's move and my second move.
					const board5 = mc.applyMove( board4, board4move );

					// Now is opponent's turn
					// TODO: something is wrong with the logic here.

					const board5value = estimateBoardValue( board5, board4move, board.turnColor );
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
};