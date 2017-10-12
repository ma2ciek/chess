import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import * as io from 'socket.io-client';
import AppContainer from './view/AppContainer';
import OfflineGameContainer from './view/OfflineGameContainer';
import OnlineGameContainer from './view/OnlineGameContainer';

interface RouterState {
	connected: boolean;
}

export default class Router extends React.Component<{}, RouterState> {
	private socket: SocketIOClient.Socket;

	constructor() {
		super();

		this.state = {
			connected: false,
		};

		this.socket = io( 'http://localhost:8081' );

		this.socket.on( 'connect', () => {
			this.setState( { connected: true } );
		} );

		this.socket.on( 'disconnect', () => {
			this.setState( { connected: false } );
		} );
	}

	public render() {
		console.log( this.state.connected );
		return (
			<BrowserRouter>
				<div id='app-container'>
					<Route path='/' exact component={ () => <AppContainer socket={ this.socket } /> } />
					<Route path='/play-offline' component={ OfflineGameContainer } />
					<Route path='/play/:gameId' component={ OnlineGameContainer } />
				</div>
			</BrowserRouter>
		);
	}
}
