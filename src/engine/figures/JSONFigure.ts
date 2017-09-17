import { Color } from '../utils';

export default JSONFigure;

interface JSONFigure {
	type: 'bishop' | 'king' | 'knight' | 'pawn' | 'queen' | 'rook';
	color: Color;
	x: number;
	y: number;
}
