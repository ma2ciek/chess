import { parse } from './fenParser';
import Bishop from './figures/Bishop';
import King from './figures/King';
import Knight from './figures/Knight';
import Pawn from './figures/Pawn';
import Queen from './figures/Queen';
import Rook from './figures/Rook';
import { FigureTypes, JSONFigure } from './utils';

export default class FigureFactory {
	public static createFromJSON( jsonFigures: ReadonlyArray<JSONFigure> ) {
		return jsonFigures.map( f => this.createFigureFromJSON( f ) );
	}

	public static createFigureFromJSON( json: JSONFigure ) {
		// TODO: Move it outside

		const types = {
			[ FigureTypes.BISHOP ]: Bishop,
			[ FigureTypes.KING ]: King,
			[ FigureTypes.KNIGHT ]: Knight,
			[ FigureTypes.PAWN ]: Pawn,
			[ FigureTypes.QUEEN ]: Queen,
			[ FigureTypes.ROOK ]: Rook,
		};

		const correctClass = types[ json.type ];

		return new correctClass( json.x, json.y, json.color );
	}

	public static createFromFenPosition( fenPosition: string ) {
		return parse( fenPosition );
	}
}
