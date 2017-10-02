import Bishop from './figures/Bishop';
import King from './figures/King';
import Knight from './figures/Knight';
import Pawn from './figures/Pawn';
import Queen from './figures/Queen';
import Rook from './figures/Rook';

export function parse( position: string ): ReadonlyArray<Bishop | Pawn | King | Queen | Rook | Knight> {
	let x = 0;
	let y = 7;
	const figures: Array<Bishop | King | Knight | Pawn | Queen | Rook> = [];

	for ( let i = 0; i < position.length; i++ ) {
		const char = position[ i ];
		switch ( char ) {
			case '/':
				if ( x !== 8 || y < 0 ) {
					throw new Error( `Parse error at char: ${ char } at position: ${ i }` );
				}
				x = 0;
				y--;
				continue; // loop

			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
				x += Number( char );
				continue;

			// Black:

			case 'r':
				figures.push( new Rook( x, y, 1 ) );
				break;

			case 'n':
				figures.push( new Knight( x, y, 1 ) );
				break;

			case 'b':
				figures.push( new Bishop( x, y, 1 ) );
				break;

			case 'q':
				figures.push( new Queen( x, y, 1 ) );
				break;

			case 'k':
				figures.push( new King( x, y, 1 ) );
				break;

			case 'p':
				figures.push( new Pawn( x, y, 1 ) );
				break;

			// White:
			case 'R':
				figures.push( new Rook( x, y, 0 ) );
				break;

			case 'N':
				figures.push( new Knight( x, y, 0 ) );
				break;

			case 'B':
				figures.push( new Bishop( x, y, 0 ) );
				break;

			case 'Q':
				figures.push( new Queen( x, y, 0 ) );
				break;

			case 'K':
				figures.push( new King( x, y, 0 ) );
				break;

			case 'P':
				figures.push( new Pawn( x, y, 0 ) );
				break;

			default:
				throw new Error( `Parse error, unexpected char: ${ char }.` );
		}

		// console.log( `char ${ char } is at position ${ x }x${ y }` );

		if ( x > 8 ) {
			throw new Error( `Parse error at char: ${ char } at position: ${ i }.` );
		}

		x++;
	}

	return figures;
}
