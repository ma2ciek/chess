type Move = Readonly<{
	x: number;
	y: number;
	type: string;
}>;

export default class BoardHistory {
	private moves: Move[] = [];

	public getLastMove() {
		return this.moves[ this.moves.length - 1 ];
	}

	public getTurn() {
		return this.moves.length % 2;
	}
}
