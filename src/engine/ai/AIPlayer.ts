import Chessboard from '../Chessboard';
import getMoveSymbol from '../getMoveSymbol';
import IPlayer from '../IPlayer';
import { getColor, Move } from '../utils';

export default abstract class AIPlayer implements IPlayer {
	public readonly abstract name: string;

	public isHuman() {
		return false;
	}

	public async move( board: Chessboard ): Promise<Move> {
		// Make it async.
		await wait( 0 );

		const d = Date.now();

		const { bestMove, counted } = await this._move( board );

		if ( !bestMove ) {
			throw new Error( 'Can not find any move for this position' );
		}

		const timeDiff = Date.now() - d;

		// tslint:disable-next-line:no-console
		console.log(
			getColor( board.turnColor ),
			this.name,
			counted,
			Math.round( counted / timeDiff * 1000 ) + ' moves/s',
			( timeDiff / 1000 ).toFixed( 1 ) + 's',
			getMoveSymbol( bestMove ),
		);

		return bestMove;
	}

	/**
	 * Method that needs to be provided by each class extending the base AIPlayer class.
	 * It needs to find the best move for the current position.
	 */
	protected abstract _move( board: Chessboard ): Promise<MoveInfo>;
}

export type MoveInfo = Readonly<{
	bestMove: Move | null;
	counted: number;
	bestMoveValue: number;
	additionalInfo?: any;
}>;

function wait( ms: number ) {
	return new Promise( res => setTimeout( res, ms ) );
}
