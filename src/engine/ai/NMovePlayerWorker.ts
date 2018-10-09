import { createChessBoardFromJSON } from '../board-utils';
import NMovePlayer from './NMovePlayer';
import { parseData } from './MultiThreadPlayer';

const player = new NMovePlayer();

self.onmessage = e => {
	const { figures, moves } = parseData( e.data );
	const board = createChessBoardFromJSON( figures, moves[ 0 ].figure.color );

	player._move( board, moves ).then( result => {
		( self as any ).postMessage( [
			result
		] );
	} );

	player.destroy();
};

