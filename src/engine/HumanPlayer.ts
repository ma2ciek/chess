import Chessboard from './Chessboard';
import IPlayer from './IPlayer';
import { IMove } from './utils';

export default class HumanPlayer implements IPlayer {
	public tryMove: ( move: IMove ) => boolean;
	private myTurn = false;

	public move( board: Chessboard ) {
		this.myTurn = true;
		this.addEventListeners();

		return new Promise<IMove>( ( res, rej ) => {
			this.tryMove = ( move: any ) => {
				if ( !board.isCorrectMove( move ) ) {
					console.log( 'incorrect' );
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
