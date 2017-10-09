import Chessboard from '../Chessboard';
import MoveController from '../MoveController';
import { FigureTypes, Move } from '../utils';
import AIPlayer, { MoveInfo } from './AIPlayer';
import { figureValueMap } from './BoardValueEstimator';
import Node from './Node';
import { applyFunctionDuringPeriod } from './utils';

type MoveNode = Node<{
	value: number
	count: number
	move: Move | null;
}>;

export default class TreePlayer extends AIPlayer {
	private root: MoveNode;
	private color: number;

	protected async _move( board: Chessboard ): Promise<MoveInfo> {
		this.color = board.getTurn();

		this.createRoot( board );

		applyFunctionDuringPeriod( () => this.applyRandomMoves( board ), 1000 );

		let maxCount = 0;
		let bestMoveValue = 0;
		let bestMove = null;

		for ( const child of this.root.children ) {
			if ( child.data.count > maxCount ) {
				maxCount = child.data.count;
				bestMoveValue = child.data.value;
				bestMove = child.data.move;
			}
		}
		return {
			counted: this.root.data.count,
			bestMove,
			bestMoveValue,
		};
	}

	private createRoot( board: Chessboard ) {
		this.root = new Node( null, {
			value: 0,
			count: 0,
			move: null,
		} );

		this.handleNewNode( board, this.root );
	}

	private applyRandomMoves( board: Chessboard ) {
		const { node, board: newBoard } = this.pickNode( board );

		this.handleNewNode( newBoard, node );

		debugger;
	}

	private handleNewNode( board: Chessboard, node: MoveNode ) {
		const moves = board.getAvailableMoves();
		let valueSum = 0;

		for ( const move of moves ) {
			const nextBoard = MoveController.applyMove( board, move );
			const value = estimateBoardValue( nextBoard, this.color );

			node.children.push(
				new Node(
					node,
					{
						value,
						count: 1,
						move,
					},
				),
			);

			valueSum += value;
		}

		node.data.value += valueSum;
		node.data.count += moves.length;

		let currentNode = node as MoveNode | null;
		while ( true ) {
			currentNode = ( currentNode as MoveNode ).parent;

			if ( currentNode ) {
				currentNode.data.value += valueSum;
				currentNode.data.count += moves.length;
			} else {
				break;
			}
		}
	}

	private pickNode( board: Chessboard ) {
		let node = this.root;
		const turn = board.getTurn();

		while ( true ) {
			node = this.pickNodeFromCurrentNode( node, turn );
			board = MoveController.applyMove( board, node.data.move as Move );

			if ( node.children.length === 0 ) {
				break;
			}
		}

		return { node, board };
	}

	private pickNodeFromCurrentNode( node: MoveNode, turn: number ) {
		// TODO: Cache values.
		const children = node.children;

		const isTurnOfMyMove = !!( node.data.move ) && ( node.data.move as Move ).figure.color === turn;

		let valueSum = 0;

		const arr = [];

		for ( const childNode of children ) {
			const { value, count } = childNode.data;

			const positiveValue = isTurnOfMyMove ?
				value / count + 100 :
				-value / count + 100;

			valueSum += positiveValue;

			arr.push( {
				positiveValue,
				node: childNode,
			} );
		}

		if ( valueSum === 0 ) {
			return arr[ 0 ].node;
		}

		if ( valueSum < 0 || valueSum > arr.length * 200 ) {
			throw new Error( `Value sum is not correct: ${ valueSum } for arr.length: ${ arr.length }.` );
		}

		let random = Math.random();
		for ( const item of arr ) {
			random -= item.positiveValue / valueSum;

			if ( random <= 0 ) {
				return item.node;
			}
		}

		throw new Error( 'Code should not reach that place.' );
	}
}

function estimateBoardValue( board: Chessboard, playerColor: number ) {
	const m = playerColor === 0 ? 1 : -1;
	let ebv = 0;

	// TODO: optimizations
	if ( board.isDraw() ) {
		return 0;
	}

	if ( board.isCheckMate() ) {
		return -100 * m;
	}

	for ( const f of board.figures ) {
		if ( f.color === playerColor ) {
			ebv += figureValueMap[ f.type ];
		} else {
			ebv -= figureValueMap[ f.type ];
		}
	}

	const lastMove = board.history.getLastMove();

	// TODO: castles instead of moving king
	if ( lastMove.figure.type === FigureTypes.KING ) {
		ebv -= 0.3 * m;
	}

	ebv += board.getPossibleMoves().length / 100 * m;

	// if ( DEVELOPMENT ) {
	if ( ebv > 100 || ebv < -100 ) {
		throw new Error( `Estimated board value is not correct: ${ ebv }.` );
	}
	// }

	return ebv;
}
