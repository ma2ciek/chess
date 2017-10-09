import ChessFigure from './figures/ChessFigure';

// TODO: Remove Board class.
export default class Board {
	public static fromFigures( figures: ReadonlyArray<ChessFigure> ) {
		const rawBoard = new Array( 64 );

		for ( const figure of figures ) {
			rawBoard[ figure.y * 8 + figure.x ] = figure;
		}

		return new Board( rawBoard );
	}

	constructor( public readonly rawBoard: ReadonlyArray<ChessFigure | undefined> ) { }

	public get( x: number, y: number ): ChessFigure | undefined {
		if ( x < 0 || y < 0 || x > 7 || y > 7 ) {
			return undefined;
		}
		return this.rawBoard[ y * 8 + x ];
	}
}
