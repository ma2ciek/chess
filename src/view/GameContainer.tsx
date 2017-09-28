import * as React from 'react';
import * as Engine from '../engine/Engine';
import { getColor } from '../engine/utils';
import Chessboard from './Chessboard';
import MoveList from './MoveList';
import Storage from './Storage';

interface GamePlayers {
	white: string;
	black: string;
}

interface GameContainerState {
	showInfo: boolean;
	players: {
		white: string;
		black: string;
	};
}

export default class GameContainer extends React.Component<{}, GameContainerState> {
	private game: Engine.Game;
	private playersStorage = new Storage<Partial<GamePlayers>>( 'game-players' );

	constructor() {
		super();

		const firstPlayerName = Object.keys( Engine.Players )[ 0 ];

		const players: GamePlayers = {
			white: firstPlayerName,
			black: firstPlayerName,
			...this.playersStorage.get(),
		};

		const WhitePlayer = Engine.Players[ players.white ] || Engine.Players[ firstPlayerName ];
		const BlackPlayer = Engine.Players[ players.white ] || Engine.Players[ firstPlayerName ];

		const whitePlayer = new WhitePlayer();
		const blackPlayer = new BlackPlayer();

		this.game = new Engine.Game( [ whitePlayer, blackPlayer ] );
		this.game.changeEmitter.subscribe( () => this.forceUpdate() );

		this.state = { showInfo: true, players: this.game.getPlayerNames() };

		( window as any ).game = this.game;
	}

	public componentDidUpdate() {
		this.playersStorage.save( this.state.players );
	}

	public render() {
		const { showInfo } = this.state;
		const board = this.game.getBoard();
		const activePlayer = this.game.getActivePlayer();
		const playerNames = this.game.getPlayerNames();

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
					<button onClick={ () => this.restart() }>RESTART</button>
				</div>

				{ this.game.paused && (
					<div className='play message-container' >
						<div>
							White: <select
								defaultValue={ playerNames.white }
								onChange={ evt => this.setWhitePlayer( evt.target.value ) }>
								{ Object.keys( Engine.Players ).map( name =>
									<option key={ name } value={ name }>{ name }</option>,
								) }
							</select>
						</div>
						<div>
							Black: <select
								defaultValue={ playerNames.black }
								onChange={ evt => this.setBlackPlayer( evt.target.value ) }>
								{ Object.keys( Engine.Players ).map( name =>
									<option key={ name } value={ name }>{ name }</option>,
								) }
							</select>
						</div>

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

	private setWhitePlayer( playerName: string ) {
		const Player = Engine.Players[ playerName ];
		const whitePlayer = new Player();
		this.game.setWhitePlayer( whitePlayer );
		this.setState( {
			players: {
				...this.state.players,
				white: playerName,
			},
		} );
	}

	private setBlackPlayer( playerName: string ) {
		const Player = Engine.Players[ playerName ];
		const blackPlayer = new Player();
		this.game.setBlackPlayer( blackPlayer );
		this.setState( {
			players: {
				...this.state.players,
				black: playerName,
			},
		} );
	}

	private restart() {
		this.setState( { showInfo: true } );
		this.game.restart();
	}
}
