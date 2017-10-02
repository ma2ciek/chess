import { FigureTypes, JSONFigure, Move, Vector } from './utils';

/**
 * https://en.wikipedia.org/wiki/Chess_notation
 * TODO
 *  - replace o-o with '0-0' everywhere.
 * @param {Move} move
 */
export default function getMoveSymbol( move: Move ): string {
	const symbol = getFigureSymbol( move.figure );
	const position = getPosition( move.dest );

	if ( move.type === 'o-o' || move.type === 'o-o-o' ) {
		return move.type.replace( /o/g, '0' );
	}

	let sep = '';

	if ( move.type === 'capture' ) {
		sep = 'x';
	}

	if ( move.figure.type === FigureTypes.PAWN && ( move.type === 'normal' || move.type === 'long-move' ) ) {
		return position;
	}

	if ( move.figure.type === FigureTypes.PAWN && move.type === 'capture' ) {
		return getColumnName( move.figure.x ) + sep + position;
	}

	return symbol + sep + position;
}

const figureSymbolMap: { [ index: number ]: string } = {
	0: 'P',
	1: 'N',
	2: 'B',
	3: 'R',
	4: 'Q',
	5: 'K',
};

function getFigureSymbol( figure: JSONFigure ): string {
	return figureSymbolMap[ figure.type ];
}

function getPosition( pos: Vector ): string {
	return getColumnName( pos.x ) + getRowName( pos.y );
}

const charCodeForA = 'a'.charCodeAt( 0 );

function getColumnName( x: number ) {
	return String.fromCharCode( charCodeForA + x );
}

function getRowName( y: number ) {
	return ( y + 1 ).toString();
}
