import JSONFigure from './figures/JSONFigure';

export function isCorrectPosition( x: number, y: number ) {
	return x >= 0 && y >= 0 && x < 8 && y < 8;
}

export function getColor( color: Color ) {
	return color === 0 ? 'White' : 'Black';
}

export type IMove = Readonly<{
	figure: JSONFigure;
	dest: Vector;
	type: 'long-move' | 'normal' | 'en-passant' | 'capture' | 'promotion-move' | 'promotion-capture' | 'o-o' | 'o-o-o' | 'fake';
}>;

export type ICommonMove = Readonly<{
	figure: JSONFigure;
	dest: Vector;
	type: 'capture' | 'normal';
}>;

export enum Color {
	White,
	Black,
}

export interface Vector {
	x: number;
	y: number;
}

export type JSONFigure = Readonly<{
    x: number;
    y: number;
    color: number;
    type: 'king' | 'knight' | 'pawn' | 'queen' | 'rook' | 'bishop';
}>;
