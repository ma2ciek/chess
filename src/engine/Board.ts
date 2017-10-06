import ChessFigure from './figures/ChessFigure';

export default class Board {
	public static fromFigures( figures: ReadonlyArray<ChessFigure> ) {
		const rawBoard = new Array( 64 );

		for ( const figure of figures ) {
			rawBoard[ figure.y * 8 + figure.x ] = figure;
		}

		return new Board( rawBoard );
	}

	constructor( public readonly rawBoard: ReadonlyArray<ChessFigure|undefined> ) { }

	public get( x: number, y: number ): ChessFigure | undefined {
		if ( x < 0 || y < 0 || x > 7 || y > 7 ) {
			return undefined;
		}
		return this.rawBoard[ y * 8 + x ];
	}

	public toString() {
		let output = '';

		for ( let y = 0; y < 8; y++ ) {
			let d = 0;
			for ( let x = 0; x < 8; x++ ) {
				const f = this.get( x, y );
				if ( f ) {
					if ( d ) {
						output += d;
						d = 0;
					}
					output += f.shortName;
				} else {
					d++;
				}
			}
			if ( d ) {
				output += d;
			}
			output += '/';
		}

		return output;
	}
}
