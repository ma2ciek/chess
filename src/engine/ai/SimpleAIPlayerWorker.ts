import { createChessBoardFromJSON } from '../board-utils';
import { parseData } from './MultiThreadPlayer';
import SimpleAIPlayer from './SimpleAIPlayer';

const player = new SimpleAIPlayer();

self.onmessage = e => {
	const { figures, moves } = parseData( e.data );
	const board = createChessBoardFromJSON( figures, moves[ 0 ].figure.color );

	player._move( board, moves ).then( result => {
		( self as any ).postMessage( [
			result,
		] );
	} );

	player.destroy();
};
