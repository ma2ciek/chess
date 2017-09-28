import { times } from 'lodash';
import * as React from 'react';
import { Chessboard as ChessboardEngine, ChessFigure, IPlayer, Move } from '../engine/Engine';
import Field from './Field';
import Figure from './Figure';

interface ChessboardProps {
	paused: boolean;
	board: ChessboardEngine;
	activePlayer: IPlayer;
}

interface ChessboardState {
	tileSize: number;
	lastSelectedFigure: ChessFigure | null;
}

export default class Chessboard extends React.Component<ChessboardProps, ChessboardState> {
	constructor( props: ChessboardProps ) {
		super( props );

		this.state = { tileSize: 64, lastSelectedFigure: null };
	}

	public componentDidMount() {
		// TODO: keydown handler.
		window.addEventListener( 'keydown', e => {
			if ( e.keyCode === 187 ) {
				this.setState( { tileSize: this.state.tileSize + 4 } );
			}
			if ( e.keyCode === 189 ) {
				this.setState( { tileSize: this.state.tileSize - 4 } );
			}
		} );
	}

	public render() {
		const { figures } = this.props.board;
		const { tileSize } = this.state;

		const style = {
			width: tileSize * 8,
			height: tileSize * 8,
		};

		const availableMoves = this.getAvailableMoves();
		const selected = this.state.lastSelectedFigure || { x: -1, y: -1 };

		return (
			<div className='chessboard' style={ style }>
				{ times( 64 ).map( ( figure, index ) => {
					const x = index % 8;
					const y = Math.floor( index / 8 );

					return <Field
						key={ Math.random() }
						x={ x }
						y={ y }
						tileSize={ tileSize }
						highlighted={ availableMoves.some( m => m.dest.x === x && m.dest.y === y ) }
						selected={ x === selected.x && y === selected.y }
						onClick={ e => this.handleClickedField( x, y ) }
					/>;
				} ) }
				{ figures.map( figure =>
					<Figure
						figure={ figure }
						key={ Math.random() }
						tileSize={ tileSize }
						onClick={ e => this.handleClickedFigure( figure ) }
					/>,
				) }
			</div>
		);
	}

	private handleClickedFigure( figure: ChessFigure ) {
		if ( !this.props.activePlayer.isHuman() || this.props.paused ) {
			return;
		}

		if ( figure.color !== this.props.board.getTurn() ) {
			this.handleClickedField( figure.x, figure.y );
			return;
		}
		const isSameFigureSelected = this.state.lastSelectedFigure === figure;
		this.setState( {
			lastSelectedFigure: isSameFigureSelected ? null : figure,
		} );
	}

	private handleClickedField( x: number, y: number ) {
		if ( !this.props.activePlayer.isHuman() || this.props.paused ) {
			return;
		}

		const availableMoves = this.getAvailableMoves();
		const { activePlayer } = this.props;

		const availableMove = availableMoves.find( m => m.dest.x === x && m.dest.y === y );

		if ( availableMove ) {
			if ( !activePlayer.tryMove ) {
				// TODO: Handle this in some other way.
				return;
			}

			const isCorrect = activePlayer.tryMove( availableMove );

			if ( isCorrect ) {
				this.setState( { lastSelectedFigure: null } );
			}
		}
	}

	private getAvailableMoves(): ReadonlyArray<Move> {
		const { board } = this.props;
		const { lastSelectedFigure } = this.state;

		if ( !lastSelectedFigure ) {
			return [];
		}

		return lastSelectedFigure.getPossibleMoves( board ).filter( move => board.isCorrectMove( move ) );
	}
}
