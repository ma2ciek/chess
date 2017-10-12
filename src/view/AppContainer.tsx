import * as React from 'react';
import { Link } from 'react-router-dom';

interface AppContainerState {
	roomId?: string;
}

interface AppContainerProps {
	socket: SocketIOClient.Socket;
}

export default class AppContainer extends React.Component<AppContainerProps, AppContainerState> {
	constructor( props: AppContainerProps ) {
		super( props );

		this.state = {};

		props.socket.on( 'room-id', ( roomId: string ) => {
			setTimeout( () => {
				this.state = { roomId };
			}, 10 );
		} );
	}

	public render() {
		return (
			<div ref='a'>
				<div>
					<button onClick={ () => this.props.socket.emit( 'play' ) }>Play online</button>
				</div>
				<div>
					<Link to='/play-offline'>Play offline</Link>
				</div>
			</div>
		);
	}
}
