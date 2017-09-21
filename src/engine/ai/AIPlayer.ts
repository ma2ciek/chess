import Chessboard from '../Chessboard';
import getMoveSymbol from '../getMoveSymbol';
import IPlayer from '../IPlayer';
import { Move } from '../utils';

export default abstract class AIPlayer implements IPlayer {
	public isHuman() {
		return false;
	}

	public async move( board: Chessboard ): Promise<Move> {
		const d = Date.now();

		const { bestMove, counted } = await this._move( board );

		if ( !bestMove ) {
			debugger;
			throw new Error( 'Can not find any move for this position' );
		}

		const timeDiff = Date.now() - d;

		console.log(
			board.getTurn() === 0 ? 'White' : 'Black',
			this.constructor.name,
			counted,
			Math.round( counted / timeDiff * 1000 ) + ' moves/s',
			getMoveSymbol( bestMove ),
		);

		return bestMove;
	}

	protected abstract _move( board: Chessboard ): Promise<MoveInfo>;
}

export type MoveInfo = Readonly<{
	bestMove: Move | null;
	counted: number;
	bestMoveValue: number;
}>;
