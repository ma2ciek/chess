import Chessboard from './Chessboard';
import Bishop from './figures/Bishop';
import King from './figures/King';
import Knight from './figures/Knight';
import Pawn from './figures/Pawn';
import Queen from './figures/Queen';
import Rook from './figures/Rook';
import { Color } from './utils';

interface ParsedData {
	figures: Figure[];
	turnColor: Color;
	castling: number[];
	enPassantMove: { x: number, y: number } | null;
	moveClock: number;
	fullMoveNumber: number;
}

type Figure = Bishop | Pawn | King | Queen | Rook | Knight;

export function parse( fenPosition: string ): ParsedData {
	let x = 0;
	let y = 7;
	let i = 0;
	const figures: Figure[] = [];

	outer:
	for ( ; i < fenPosition.length; i++ ) {
		const char = fenPosition[ i ];
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

			case ' ':
				break outer;

			default:
				throw new Error( `Parse error, unexpected char: ${ char }.` );
		}

		// console.log( `char ${ char } is at position ${ x }x${ y }` );

		if ( x > 8 ) {
			throw new Error( `Parse error at char: ${ char } at position: ${ i }.` );
		}

		x++;
	}

	const turnColor: Color = fenPosition[ ++i ] === 'w' ? Color.White : Color.Black;
	i++;

	const castling = [ 0, 0 ];

	outer:
	while ( true ) {
		const char = fenPosition[ ++i ];

		switch ( char ) {
			case ' ':
			case '-':
				break outer;

			case 'K':
				castling[ 0 ] |= 1;
				break;

			case 'Q':
				castling[ 0 ] |= 2;
				break;

			case 'k':
				castling[ 1 ] |= 1;
				break;

			case 'q':
				castling[ 1 ] |= 2;
				break;
		}
	}

	i++;
	let enPassantMove: null | { x: number, y: number } = null;
	if ( fenPosition[ i ] !== '-' ) {
		enPassantMove = {
			x: Number( fenPosition[ i ] ),
			y: fenPosition[ ++i ].charCodeAt( 0 ) - 97,
		};
	}
	i++;

	let text = '';
	while ( fenPosition[ ++i ] !== ' ' ) {
		text += fenPosition[ i ];
	}

	const moveClock = Number( text );

	text = '';

	while ( ++i < fenPosition.length ) {
		text += fenPosition[ i ];
	}

	const fullMoveNumber = Number( text );

	return { figures, turnColor, castling, enPassantMove, moveClock, fullMoveNumber };
}

export function stringify( chessBoard: Chessboard ) {
	let output = '';

	for ( let y = 7; y >= 0; y-- ) {
		let d = 0;
		for ( let x = 0; x < 8; x++ ) {
			const f = chessBoard.board[ y * 8 + x ];
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

		if ( y > 0 ) {
			output += '/';
		}
	}

	output += ' ';

	if ( chessBoard.turnColor === Color.White ) {
		output += 'w';
	} else {
		output += 'b';
	}

	return output;
}
