import * as React from 'react';
import { BoardHistory } from '../engine/Engine';
import { IMove, JSONFigure, Vector } from '../engine/utils';

interface MoveListProps {
	history: BoardHistory;
}

export default class MoveList extends React.Component<MoveListProps> {
	public render() {
		const { history } = this.props;

		const whitePlayerMoves = history.getMoves( 0 );
		const blackPlayerMoves = history.getMoves( 1 );

		return (
			<div className='move-list'>
				<div>
					{ whitePlayerMoves.map( move =>
						<div key={ Math.random() }>{ getMoveSymbol( move ) }</div>,
					) }
				</div>
				<div>
					{ blackPlayerMoves.map( move =>
						<div key={ Math.random() }>{ getMoveSymbol( move ) }</div>,
					) }
				</div>
			</div>
		);
	}
}

function getMoveSymbol( move: IMove ) {
	const symbol = getFigureSymbol( move.figure );
	const position = getPosition( move.dest );

	if ( move.type === 'o-o' || move.type === 'o-o-o' ) {
		return move.type;
	}

	let sep = ' ';

	if ( move.type === 'capture' ) {
		sep = 'x';
	}

	if ( move.figure.type === 'pawn' && move.type === 'normal' ) {
		return position;
	}

	return symbol + sep + position;
}

const figureSymbolMap = {
	king: 'k',
	knight: 'n',
	bishop: 'b',
	pawn: 'p',
	queen: 'q',
	rook: 'r',
};

function getFigureSymbol( figure: JSONFigure ) {
	const charCode = figureSymbolMap[ figure.type ].charCodeAt( 0 );
	return String.fromCharCode( figure.color === 0 ? charCode - 32 : charCode );
}

function getPosition( pos: Vector ) {
	const charCodeForA = 'a'.charCodeAt( 0 );
	const col = String.fromCharCode( charCodeForA + pos.x );
	const row = ( pos.y + 1 ).toString();

	return col + row;
}
