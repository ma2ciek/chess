import ChessFigure from './figures/ChessFigure';

export default class Board {
	private _board: ChessFigure[] = new Array( 64 );

	constructor( figures: ReadonlyArray<ChessFigure> ) {
		for ( const figure of figures ) {
			this._board[ figure.y * 8 + figure.x ] = figure;
		}
	}

	public get( x: number, y: number ): ChessFigure | undefined {
		if ( x < 0 || y < 0 || x > 7 || y > 7 ) {
			return undefined;
		}
		const index = y * 8 + x;
		return this._board[ index ];
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
