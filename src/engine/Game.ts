import { createChessBoardAtInitialPosition, isCurrentPlayerCheckmated, isDraw } from './board-utils';
import Chessboard from './Chessboard';
import Emitter from './Emitter';
import IPlayer, { PlayerConstructor } from './IPlayer';
import MoveController from './MoveController';
import { Color, Move } from './utils';

type GameInfo = Readonly<{
	draw: boolean;
	type: '' | 'CHECK_MATE' | 'NO_MOVE_AVAILABLE';
	win: boolean;
	lastPlayer: -1 | Color; // -1 - none | 0 - white | 1 - black.
}>;

export default class Game {
	public readonly changeEmitter = new Emitter();
	public readonly history: Move[] = [];

	private isPaused = true;
	private info: GameInfo = {
		draw: false,
		type: '',
		win: false,
		lastPlayer: -1,
	};

	constructor(
		private players: IPlayer[],
		private board = createChessBoardAtInitialPosition(),
	) { }

	public restart() {
		this.board = createChessBoardAtInitialPosition();
		this.isPaused = true;
		this.info = {
			draw: false,
			type: '',
			win: false,
			lastPlayer: -1,
		};
		this.changeEmitter.emit();
	}

	public getPlayers(): ReadonlyArray<IPlayer> {
		return this.players;
	}

	public getPlayerNames() {
		return {
			white: ( this.players[ 0 ].constructor as PlayerConstructor ).playerName,
			black: ( this.players[ 1 ].constructor as PlayerConstructor ).playerName,
		};
	}

	public setWhitePlayer( player: IPlayer ) {
		const p = this.players[ 0 ];
		if ( p.destroy ) { p.destroy(); }
		this.players[ 0 ] = player;
		this.changeEmitter.emit();
	}

	public setBlackPlayer( player: IPlayer ) {
		const p = this.players[ 1 ];
		if ( p.destroy ) { p.destroy(); }
		this.players[ 1 ] = player;
		this.changeEmitter.emit();
	}

	public getInfo() {
		return { ...this.info };
	}

	public getBoard() {
		return this.board;
	}

	public setBoard( board: Chessboard ) {
		this.pause();
		this.board = board;
	}

	public getActivePlayer() {
		return this.players[ this.board.turnColor ];
	}

	public start() {
		if ( this.isPaused ) {
			this.isPaused = false;
			this.play();
			this.changeEmitter.emit();
			// TODO: handling pending move.
		}
	}

	public get paused() {
		return this.isPaused;
	}

	public pause() {
		if ( !this.isPaused ) {
			this.isPaused = true;
			this.changeEmitter.emit();
		}

		// TODO: handling pending move.
	}

	private play() {
		if ( this.isPaused ) {
			return;
		}

		const activePlayer = this.players[ this.board.turnColor ];

		activePlayer.move( this.board ).then( move => {
			if ( this.isPaused ) {
				return;
			}

			this.history.push( move );

			// Save player color before switch.
			const turnColor = this.board.turnColor;
			this.board = MoveController.applyMove( this.board, move );

			if ( isCurrentPlayerCheckmated( this.board ) ) {
				this.info = {
					win: true,
					type: 'CHECK_MATE',
					lastPlayer: turnColor,
					draw: false,
				};

			} else if ( isDraw( this.board ) ) {
				this.info = {
					win: false,
					type: 'NO_MOVE_AVAILABLE',
					lastPlayer: turnColor,
					draw: true,
				};
			}

			this.changeEmitter.emit();

			if ( !this.info.draw && !this.info.win ) {
				this.play();
			}
		} );
	}
}
