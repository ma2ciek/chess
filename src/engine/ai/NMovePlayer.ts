import Chessboard from '../Chessboard';
import getMoveSymbol from '../getMoveSymbol';
import MoveController from '../MoveController';
import { Move } from '../utils';
import AIPlayer, { MoveInfo } from './AIPlayer';
import BoardValueEstimator from './BoardValueEstimator';

export default class NMovePlayer extends AIPlayer {
	public static readonly playerName = 'AI: N-Move Player';

	private bve = new BoardValueEstimator();

	public destroy() {
		this.bve.clearAll();
	}

	// TODO - it should be protected method.
	public async _move( initialBoard: Chessboard, initialMoves = initialBoard.getAvailableMoves() ): Promise<MoveInfo> {
		const startTime = Date.now();

		let moveInfo: MoveInfo | null = null;
		let maxDeep = 3;

		while ( Date.now() - startTime < 1000 ) {
			moveInfo = this.calculateBestMove( initialBoard, initialMoves, maxDeep );

			maxDeep++;
		}

		if ( moveInfo && moveInfo.bestMove ) {
			// tslint:disable-next-line:no-console
			console.log(
				`Deep: ${ maxDeep }`,
				getMoveSymbol( moveInfo.bestMove ),
				moveInfo.bestMoveValue,
				moveInfo.counted,
			);
		}

		return moveInfo!;
	}

	private calculateBestMove( initialBoard: Chessboard, initialMoves: ReadonlyArray<Move>, maxDeep: number ): MoveInfo {
		const tree: TreeLevel[] = [];

		tree.push( {
			bestMoveValue: -Infinity,
			bestMove: null,
			counter: 0,
			nextMoves: initialMoves,
			moveIndex: 0,
			board: initialBoard,
		} );

		while ( true ) {
			const deep = tree.length - 1;
			const level = tree[ deep ];
			const move = level.nextMoves[ level.moveIndex ];

			if ( !move ) {
				// Go down. All tree siblings are already calculated.

				const downLevel = tree[ deep - 1 ];

				// Pass opponent's best move as the worst move for the given player.
				const negativeBestOpponentMoveValue = -level.bestMoveValue;

				if ( negativeBestOpponentMoveValue > downLevel.bestMoveValue ) {
					// TODO:
					downLevel.bestMove = downLevel.nextMoves[ downLevel.moveIndex ];
					downLevel.bestMoveValue = negativeBestOpponentMoveValue;
				}

				downLevel.counter += level.counter;
				downLevel.moveIndex++;

				if ( deep === 1 && !downLevel.nextMoves[ downLevel.moveIndex ] ) {
					break;
				}

				tree.pop();
				continue;
			}

			const nextBoard = MoveController.applyMove( level.board, move );

			// Value is calculated for the given player.
			const value = -this.bve.estimateValue( nextBoard );

			if ( deep < maxDeep ) {
				// Go deeper, but break when the draw or win position is reached.

				// It means that after that move the opponent's king is gone.
				// In other words, the move before was a checkmate move.
				if ( value > 100 ) {
					const downLevel = tree[ deep - 1 ];

					// Still, it might be one of the best possible moves for the previous player.
					// He can be checkmate in few ways.
					if ( -value > downLevel.bestMoveValue ) {
						downLevel.bestMove = downLevel.nextMoves[ downLevel.moveIndex ];
						downLevel.bestMoveValue = -value;
					}

					downLevel.counter += level.counter;
					downLevel.moveIndex++;

					tree.pop();
					continue;
				}

				// if ( isDraw( nextBoard ) ) {
				// 	if ( level.bestMoveValue < 0 ) {
				// 		level.bestMove = move;
				// 		level.bestMoveValue = 0;
				// 	}

				// 	level.moveIndex++;
				// 	level.counter++;

				// 	continue;
				// }

				const nextBoardPossibleMoves = nextBoard.getPossibleMoves();

				tree.push( {
					bestMoveValue: -Infinity,
					bestMove: null,
					counter: 0,
					nextMoves: nextBoardPossibleMoves,
					moveIndex: 0,
					board: nextBoard,
				} );
			} else {
				// If the deep is to big, just store value.

				if ( value > level.bestMoveValue ) {
					level.bestMove = move;
					level.bestMoveValue = value;
				}

				level.moveIndex++;
				level.counter++;
			}
		}

		return {
			bestMove: tree[ 0 ].bestMove,
			bestMoveValue: tree[ 0 ].bestMoveValue,
			counted: tree[ 0 ].counter,
		};
	}
}

interface TreeLevel {
	bestMoveValue: number;
	bestMove: null | Move;
	counter: number;
	nextMoves: ReadonlyArray<Move>;
	moveIndex: number;
	board: Chessboard;
}
