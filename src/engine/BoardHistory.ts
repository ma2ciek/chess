import { IMove } from './utils';

export default class BoardHistory {
	constructor(
		public readonly moves: IMove[] = [],
	) { }

	public getMoves( playerColor: number ) {
		return this.moves.filter( ( move, index ) => index % 2 === playerColor );
	}

	public getMyMoves() {
		const turn = this.getTurn();
		return this.moves.filter( ( move, index ) => index % 2 === turn );
	}

	public getOpponentMoves() {
		const turn = this.getTurn();
		return this.moves.filter( ( move, index ) => index % 2 === turn );
	}

	public getLastMove() {
		return this.moves[ this.moves.length - 1 ];
	}

	/**
	 * White equals 0.
	 */
	public getTurn() {
		return this.moves.length % 2;
	}
}
