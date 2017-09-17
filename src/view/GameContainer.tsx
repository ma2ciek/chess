import * as React from 'react';
import * as Engine from '../engine/Engine';
import { getColor } from '../engine/utils';
import Chessboard from './Chessboard';

// import MoveList from './MoveList';

interface GameContainerState {
	game: Engine.Game;
	showInfo: boolean;
}

export default class GameContainer extends React.Component<{}, GameContainerState> {
	constructor() {
		super();

		const whitePlayer = new Engine.SimpleAIPlayer();
		const blackPlayer = new Engine.SimpleAIPlayer();

		const game = new Engine.Game( [ whitePlayer, blackPlayer ] );
		game.changeEmitter.subscribe( () => this.forceUpdate() );

		this.state = { game, showInfo: true };

		( window as any ).game = game;
	}

	public render() {
		const { showInfo, game } = this.state;
		const board = game.getBoard();
		const activePlayer = game.getActivePlayer() as Engine.HumanPlayer;

		const info = game.getInfo();
		const color = getColor( info.lastPlayer );

		// TODO: buttons
		// TODO: <MoveList history={ board.history } />

		return (
			<div className='game-container'>
				<div className='board-container'>
					<Chessboard board={ board } activePlayer={ activePlayer } />
					{/* <MoveList history={ board.history } /> */ }
				</div>

				<div className='button-section'>
					<select defaultValue='SimpleAIPlayer' onChange={ evt => this.setWhitePlayer( evt.target.value ) }>
						{ Object.keys( Engine.Players ).map( name =>
							<option key={ name } value={ name }>{ name }</option>,
						) }
					</select>
					<select defaultValue='SimpleAIPlayer' onChange={ evt => this.setBlackPlayer( evt.target.value ) }>
						{ Object.keys( Engine.Players ).map( name =>
							<option key={ name } value={ name }>{ name }</option>,
						) }
					</select>
					<button onClick={ () => { this.state.game.start(); } }>START</button>
					<button onClick={ () => { this.state.game.pause(); } }>PAUSE</button>
					<button onClick={ () => this.restart() }>RESTART</button>
				</div>

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
		this.state.game.setWhitePlayer( whitePlayer );
	}

	private setBlackPlayer( playerName: string ) {
		const Player = Engine.Players[ playerName ];
		const blackPlayer = new Player();
		this.state.game.setBlackPlayer( blackPlayer );
	}

	private restart() {
		this.setState( { showInfo: true } );
		this.state.game.restart();
	}
}
