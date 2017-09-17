import Chessboard from './Chessboard';
import IPlayer from './IPlayer';
import MoveController from './MoveController';
import { IMove } from './utils';

export default class SimpleAIPlayer implements IPlayer {
	public isHuman() {
		return false;
	}

	public move( board: Chessboard ) {
		return wait( 0 ).then( () => {
			const d = Date.now();

			const { bestMove, counted } = this.moveSync( board );
			console.log( Math.round( counted / ( Date.now() - d ) * 1000 ) + ' moves/s' );

			return bestMove;
		} );
	}

	private moveSync( board: Chessboard ) {
		const moves = board.getAvailableMoves();
		const mc = new MoveController();
		let bestValueForBoard2 = -Infinity;
		let bestMove;
		let counted = 0;

		for ( const move of shuffle( moves ) ) {
			const board2 = mc.applyMove( board, move );
			const board2moves = board2.getAvailableMoves();
			let worstValueForBoard3 = Infinity;

			if ( board2.isCheckMate() ) {
				bestValueForBoard2 = Infinity;
				bestMove = move;
				break;
			}

			if ( board2.isDraw() ) {
				worstValueForBoard3 = 0;
				if ( bestValueForBoard2 < worstValueForBoard3 ) {
					bestValueForBoard2 = worstValueForBoard3;
					bestMove = move;
				}
				continue;
			}

			for ( const board2move of shuffle( board2moves ) ) {
				const board3 = mc.applyMove( board2, board2move );
				const board3moves = board3.getAvailableMoves();
				let bestValueForBoard4 = -Infinity;

				if ( board3.isCheckMate() ) {
					worstValueForBoard3 = -Infinity;
					break;
				}

				if ( board3.isDraw() ) {
					worstValueForBoard3 = 0;
					continue;
				}

				for ( const board3move of shuffle( board3moves ) ) {
					const board4 = mc.applyMove( board3, board3move );
					const board4value = estimateValue( board4, board3move );
					bestValueForBoard4 = Math.max( board4value, bestValueForBoard4 );
					counted++;
				}

				worstValueForBoard3 = Math.min( bestValueForBoard4, worstValueForBoard3 );
				counted++;
			}

			if ( bestValueForBoard2 < worstValueForBoard3 ) {
				bestValueForBoard2 = worstValueForBoard3;
				bestMove = move;
			}

			counted++;
		}

		return {
			bestMove,
			counted,
		};
	}
}

function wait( time: number ) {
	return new Promise( res => setTimeout( res, time ) );
}

function shuffle<T>( arr: T[] ) {
	const arr2 = arr.slice( 0 );
	const result = [];

	while ( arr2.length ) {
		const index = Math.floor( Math.random() * arr2.length );
		const [ item ] = arr2.splice( index, 1 );
		result.push( item );
	}
	return result;
}

const figureValueMap = {
	king: 1000, // Can't be removed from board.
	queen: 9,
	pawn: 1,
	rook: 5,
	bishop: 3,
	knight: 3,
};

function estimateValue( board: Chessboard, lastMove: IMove ) {
	let sum = 0;
	const turnColor = board.turnColor;

	// TODO - optimization
	// if ( board.isDraw() ) {
	// 	return 0;
	// }

	// if ( board.isCheckMate() ) {
	// 	return -1000;
	// }

	// if ( board.isCurrentKingChecked() ) {
	// 	sum -= 0.1;
	// }

	for ( const f of board.figures ) {
		if ( f.color === turnColor ) {
			sum -= figureValueMap[ f.type ];
		} else {
			sum += figureValueMap[ f.type ];
		}
	}

	// last move was the opponent's move.
	if ( lastMove.figure.type === 'king' ) {
		sum -= 0.3;
	}

	sum += Math.random() / 2;

	sum += board.getPossibleMoves().length / 100;

	return sum;
}
