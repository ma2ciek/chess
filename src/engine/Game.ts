import Chessboard from './Chessboard';
import Emitter from './Emitter';
import IPlayer from './IPlayer';
import MoveController from './MoveController';

export default class Game {
	public readonly changeEmitter = new Emitter();

	private readonly moveCtrl = new MoveController();
	private isPaused = true;
	private info = {
		draw: false,
		type: '',
		win: false,
		lastPlayer: -1,
	};

	constructor(
		private players: IPlayer[],
		private board = Chessboard.createInitialPosition(),
	) { }

	public restart() {
		this.board = Chessboard.createInitialPosition();
		this.isPaused = true;
		this.info = {
			draw: false,
			type: '',
			win: false,
			lastPlayer: -1,
		};
		this.changeEmitter.emit();
	}

	public setWhitePlayer( player: IPlayer ) {
		this.players[ 0 ] = player;
		this.changeEmitter.emit();
	}

	public setBlackPlayer( player: IPlayer ) {
		this.players[ 1 ] = player;
		this.changeEmitter.emit();
	}

	public getInfo() {
		return { ...this.info };
	}

	public getBoard() {
		return this.board;
	}

	public getActivePlayer() {
		return this.players[ this.board.getTurn() ];
	}

	public start() {
		if ( this.isPaused ) {
			this.isPaused = false;
			this.play();
			// TODO - handling pending move.
		}
	}

	public pause() {
		this.isPaused = true;
		// TODO - handling pending move.
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

			// Save player color before switch.
			const turnColor = this.board.turnColor;
			this.board = this.moveCtrl.applyMove( this.board, move );

			if ( this.board.isCheckMate() ) {
				this.info.win = true;
				this.info.type = 'CHECK_MATE';
				this.info.lastPlayer = turnColor;
			}

			if ( this.board.isDraw() ) {
				this.info.draw = true;
				this.info.type = 'NO_MOVE_AVAILABLE';
				this.info.lastPlayer = turnColor;
			}

			this.changeEmitter.emit();

			if ( !this.info.draw && !this.info.win ) {
				this.play();
			}
		} );
	}
}
