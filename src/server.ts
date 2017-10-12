import * as express from 'express';
import * as path from 'path';
import * as socketIO from 'socket.io';
import { Move } from './engine/utils';

const io = socketIO( 8081 );

const app = express();

app.use( '/public', express.static( 'build' ) );

app.get( '*', ( req, res ) => {
	const indexHtml = path.join( __dirname, '..', 'index.html' );
	console.log( indexHtml );
	res.sendFile( indexHtml, 'utf-8' );
} );

app.get( '/', ( req, res ) => {
	const indexHtml = path.join( __dirname, '..', 'index.html' );
	console.log( indexHtml );
	res.sendFile( indexHtml, 'utf-8' );
} );

const PORT = process.env.PORT || 8080;

app.listen( PORT, () => {
	console.log( `App is running on the http://localhost:${ PORT }` );
} );

let waitingPlayers: SocketIO.Socket[] = [];
const games: Game[] = [];

io.on( 'connection', ( socket ) => {
	console.log( `New user: ${ socket.id }` );

	socket.on( 'play', () => {
		if ( waitingPlayers.includes( socket ) ) {
			return;
		}
		waitingPlayers.push( socket );

		if ( waitingPlayers.length === 2 ) {
			const game = new Game( waitingPlayers );
			games.push( game );
			waitingPlayers = [];
		} else {
			socket.emit( 'play-waiting' );
		}
	} );
} );

class Game {
	private players: SocketIO.Socket[];
	private id: string;

	constructor( players: SocketIO.Socket[] ) {
		this.id = generateUUID();
		this.players = players;

		players[ 0 ].emit( 'room-id', this.id );
		players[ 1 ].emit( 'room-id', this.id );

		players[ 0 ].on( 'move', ( move: Move ) => {
			players[ 1 ].emit( 'enemy-move', move );
		} );

		players[ 1 ].on( 'move', ( move: Move ) => {
			players[ 0 ].emit( 'enemy-move', move );
		} );
	}
}

function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, ( c ) => {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : ( r & 0x3 | 0x8 );
		return v.toString( 16 );
	} );
}
