import * as React from 'react';
import * as Engine from '../engine/Engine';
import { getColor } from '../engine/utils';
import Chessboard from './Chessboard';
import MoveList from './MoveList';
import SocketPlayer from './SocketPlayer';

interface OnlineGameContainerState {
	showInfo: boolean;
}

interface OnlineGameContainerProps {
	socket: SocketIOClient.Socket;
}

export default class OnlineGameContainer extends React.Component<OnlineGameContainerProps, OnlineGameContainerState> {
	private game: Engine.Game;

	constructor() {
		super();

		const whitePlayer = new Engine.HumanPlayer();
		const blackPlayer = new SocketPlayer( this.props.socket );

		this.game = new Engine.Game( [ whitePlayer, blackPlayer ] );

		this.game.changeEmitter.subscribe( () => {
			this.forceUpdate();
		} );

		this.state = { showInfo: true };
	}

	public render() {
		const { showInfo } = this.state;
		const board = this.game.getBoard();
		const activePlayer = this.game.getActivePlayer();

		const info = this.game.getInfo();
		const color = getColor( info.lastPlayer );

		return (
			<div className='game-container'>
				<div className='board-container'>
					<Chessboard board={ board } activePlayer={ activePlayer } paused={ this.game.paused } />
					<MoveList history={ board.history } />
				</div>

				<div className='button-section'>
					<button onClick={ () => { this.game.pause(); } }>PAUSE</button>
				</div>

				{ this.game.paused && (
					<div className='play message-container'>

						<button onClick={ () => this.game.start() }>Start</button>
					</div>
				) }

				{ info.draw && showInfo && (
					<div className='draw message-container' onClick={ () => this.setState( { showInfo: false } ) }>
						<h1>It's a draw</h1>
					</div>
				) }

				{ info.win && showInfo && (
					<div className='win message-container' onClick={ () => this.setState( { showInfo: false } ) }>
						<h1>{ color } player wins.</h1>
					</div>
				) }

			</div>

		);
	}

}
