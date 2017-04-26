import Chessboard from './Chessboard';

export function isCorrectPosition( x: number, y: number ) {
	return x >= 0 && y >= 0 && x < 8 && y < 8;
}

export interface ICommonMove {
	x: number;
	y: number;
	type: 'capture' | 'normal-move';
}

export enum Color {
    White,
    Black,
};
