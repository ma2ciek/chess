import Bishop from './figures/Bishop';
import King from './figures/King';
import Knight from './figures/Knight';
import Pawn from './figures/Pawn';
import Queen from './figures/Queen';
import Rook from './figures/Rook';
import { FigureTypes, JSONFigure } from './utils';

export const figureClasses = {
	[ FigureTypes.BISHOP ]: Bishop,
	[ FigureTypes.KING ]: King,
	[ FigureTypes.KNIGHT ]: Knight,
	[ FigureTypes.PAWN ]: Pawn,
	[ FigureTypes.QUEEN ]: Queen,
	[ FigureTypes.ROOK ]: Rook,
};

export default class FigureFactory {
	public static createFiguresFromJSON( jsonFigures: ReadonlyArray<JSONFigure> ) {
		return jsonFigures.map( f => this.createFigureFromJSON( f ) );
	}

	public static createFigureFromJSON( json: JSONFigure ) {
		const FigureClass = figureClasses[ json.type ];

		return new FigureClass( json.x, json.y, json.color );
	}
}
