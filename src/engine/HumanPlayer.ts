import { isCorrectMove } from './board-utils';
import Chessboard from './Chessboard';
import IPlayer from './IPlayer';
import { Move } from './utils';

export default class HumanPlayer implements IPlayer {
	public readonly name = 'Human';

	public tryMove?: ( move: Move ) => boolean;
	private myTurn = false;

	public move( board: Chessboard ) {
		this.myTurn = true;
		this.addEventListeners();

		return new Promise<Move>( ( res, rej ) => {
			this.tryMove = ( move: any ) => {
				if ( !isCorrectMove( board, move ) ) {
					return false;
				}

				res( move );
				this.removeEventListeners();
				this.myTurn = false;
				return true;
			};
		} );
	}

	public isHuman() {
		return true;
	}

	public isMyTurn() {
		return this.myTurn;
	}

	private addEventListeners() {
		// TODO
	}

	private removeEventListeners() {
		// TODO
	}
}
