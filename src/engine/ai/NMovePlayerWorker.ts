import { createChessBoardFromJSON } from '../board-utils';
import { parseData } from './MultiThreadPlayer';
import NMovePlayer from './NMovePlayer';

const player = new NMovePlayer();

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
