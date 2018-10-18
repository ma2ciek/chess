import Chessboard from '../Chessboard';
import AIPlayer, { MoveInfo } from './AIPlayer';
import BoardValueEstimator from './BoardValueEstimator';
import { shuffle } from './utils';

export default class RandomAIPlayer extends AIPlayer {
	public readonly name = 'AI: Random Player';

	private bve = new BoardValueEstimator();

	public destroy() {
		this.bve.clearAll();
	}

	protected async _move( board: Chessboard ): Promise<MoveInfo> {
		const board1moves = board.getAvailableMoves();
		const bestMove = shuffle( board1moves )[ 0 ];

		return {
			bestMove,
			counted: 0,
			bestMoveValue: 0,
		};
	}

}
