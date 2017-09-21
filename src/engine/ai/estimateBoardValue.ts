import Chessboard from '../Chessboard';
import { Move } from '../utils';

const figureValueMap = {
	king: 1000, // Can't be removed from board.
	queen: 9,
	pawn: 1,
	rook: 5,
	bishop: 3,
	knight: 3,
};

export default function estimateValue( board: Chessboard, lastMove: Move, playerColor: number ) {
	let sum = 0;

	// TODO - optimization
	// if ( board.isDraw() ) {
	// 	return 0;
	// }

	// if ( board.isCheckMate() ) {
	// 	return -1000;
	// }

	// if ( board.isCurrentKingChecked() ) {
	// 	sum -= 0.1;
	// }

	for ( const f of board.figures ) {
		if ( f.color === playerColor ) {
			sum += figureValueMap[ f.type ];
		} else {
			sum -= figureValueMap[ f.type ];
		}
	}

	if ( lastMove.figure.type === 'king' && lastMove.figure.color === playerColor ) {
		sum -= 0.3;
	}

	sum += Math.random() / 2 - 0.25;

	sum += board.getPossibleMoves().length / 100;

	return sum;
}
