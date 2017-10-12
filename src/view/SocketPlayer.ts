import Chessboard from '../engine/Chessboard';
import IPlayer from '../engine/IPlayer';
import { Move } from '../engine/utils';

export default class SocketPlayer implements IPlayer {
	private resolve: ( value: Move ) => void;

	constructor( socket: SocketIOClient.Socket ) {
		socket.on( 'enemy-move', ( move: Move ) => {
			this.resolve( move );
		} );
	}

	public isHuman() {
		return false;
	}

	public async move( board: Chessboard ) {
		return new Promise<Move>( resolve => {
			this.resolve = resolve;
		} );
	}
}
