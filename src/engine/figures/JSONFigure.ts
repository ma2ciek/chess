import { Color } from '../utils';

export default JSONFigure;

export type FigureType = 'bishop' | 'king' | 'knight' | 'pawn' | 'queen' | 'rook';

interface JSONFigure {
	type: FigureType;
	color: Color;
	x: number;
	y: number;
}
