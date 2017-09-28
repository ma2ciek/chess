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
				// After my move and opponent's move and my second move.
				const board4 = mc.applyMove( board3, board3move );

				// Now is opponent's turn
				// TODO: something is wrong with the logic here.

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

	(self as any).postMessage( [ {
		bestMove,
		counted,
		bestMoveValue: bestValueForBoard2,
	} ] );
};