import Bishop from './figures/Bishop';
import JSONFigure from './figures/JSONFigure';
import King from './figures/King';
import Knight from './figures/Knight';
import Pawn from './figures/Pawn';
import Queen from './figures/Queen';
import Rook from './figures/Rook';

export default class FigureFactory {
	public static createFromJSON( json: JSONFigure ) {
		const types = {
			bishop: Bishop,
			king: King,
			knight: Knight,
			pawn: Pawn,
			queen: Queen,
			rook: Rook,
		};

		const correctClass = types[ json.type ];

		return new correctClass( json.x, json.y, json.color );
	}
}
