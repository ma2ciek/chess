import ChessFigure from './figures/ChessFigure';

export function isCorrectPosition( x: number, y: number ) {
	return x >= 0 && y >= 0 && x < 8 && y < 8;
}

export type Move = Readonly<{
	figure: JSONFigure;
	dest: Vector; // TODO: change vector to position's index.
	type: MoveTypes;
	check?: true;
	mate?: true;
}>;

// TODO: Convert move types to this enum.
export const enum MoveTypes {
	LONG_MOVE,
	NORMAL,
	EN_PASSANT,
	CAPTURE,
	PROMOTION,
	PROMOTION_CAPTURE,
	CASTLE_KINGSIDE,
	CASTLE_QUEENSIDE,
	FAKE,
}

// TODO: Use this enum everywhere.
export const enum Color {
	White,
	Black,
}

export interface Vector {
	x: number;
	y: number;
}

export const KING_CASTLE_FLAG = 1;
export const QUEEN_CASTLE_FLAG = 2;

export enum FigureTypes {
	PAWN,
	KNIGHT,
	BISHOP,
	ROOK,
	QUEEN,
	KING,
}

export function figureToString( figure: ChessFigure ) {
	return getColor( figure.color ) + ' ' + figure.type + ', ' + getHumanPosition( figure );
}

export function getColor( color: Color ) {
	return color === Color.White ? 'White' : 'Black';
}

export function getHumanPosition( figure: ChessFigure ) {
	const charCodeA = 'A'.charCodeAt( 0 );
	const humanX = String.fromCharCode( charCodeA + figure.x );
	const humanY = ( figure.y + 1 ).toString();

	return humanX + humanY;
}

export type JSONFigure = Readonly<{
	x: number;
	y: number;
	color: Color;
	type: FigureTypes;
}>;
