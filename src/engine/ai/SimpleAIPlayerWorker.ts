import Chessboard from '../Chessboard';
import { JSONFigure, Move } from '../utils';
import { createChessBoardFromJSON } from '../board-utils';
import SimpleAIPlayer from './SimpleAIPlayer';

const player = new SimpleAIPlayer();

self.onmessage = e => {
	const [ figures, board1moves ] = e.data as [ JSONFigure[], Move[] ];

	const board: Chessboard = createChessBoardFromJSON( figures, board1moves[ 0 ].figure.color );

	player._move( board, board1moves ).then( result => {
		( self as any ).postMessage( [
			result
		] );
	} );

	player.destroy();
};
