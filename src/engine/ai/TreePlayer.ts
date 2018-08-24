import Chessboard from '../Chessboard';
import MoveController from '../MoveController';
import { Move } from '../utils';
import AIPlayer, { MoveInfo } from './AIPlayer';
import { figureValueMap } from './BoardValueEstimator';
import Node from './Node';
import { applyFunctionDuringPeriod } from './utils';

type MoveNode = Node<{
	value: number
	count: number
	move: Move | null;
	visited: boolean;
}>;

// TODO: Each move should trigger new instance.
export default class TreePlayer extends AIPlayer {
	// protected methods that can be easily override in tests.
	protected estimateBoardValue = estimateBoardValue;
	protected applyFunctionDuringPeriod = applyFunctionDuringPeriod;

	// TODO: Use some salt.
	protected mathRandom = Math.random;

	protected root?: MoveNode;
	protected color?: 0 | 1;

	protected async _move( board: Chessboard ): Promise<MoveInfo> {
		this.color = board.getTurn();

		this.createRoot( board );

		this.applyFunctionDuringPeriod( () => this.applyRandomMove( board ), 3000 );

		let maxCount = 0;
		let bestMove = null;

		for ( const child of this.root!.children ) {
			if ( child.data.count > maxCount ) {
				maxCount = child.data.count;
				bestMove = child;
			}
		}
		return {
			counted: this.root!.data.count,
			bestMove: bestMove!.data.move,
			bestMoveValue: bestMove!.data.value,
			root: JSON.stringify( this.root ),
		} as any;
	}

	protected createRoot( board: Chessboard ) {
		this.root = new Node( null, {
			value: 0,
			count: 0,
			move: null,
			visited: true,
		} );

		this.createSubNodes( board, this.root );
	}

	protected applyRandomMove( board: Chessboard ) {
		const { node, board: newBoard } = this.pickNotVisitedRandomNode( board );

		this.applyMove( newBoard, node );
	}

	protected applyMove( board: Chessboard, node: MoveNode ) {
		// Mark node as visited.
		node.data.visited = true;

		// Estimate value for given node.
		const value = this.estimateBoardValue( board, this.color as 0 | 1 );

		// Backward propagation.
		let newNode: MoveNode | null = node;
		while ( newNode ) {
			newNode.data.count++;
			newNode.data.value += value;

			newNode = newNode.parent;
		}

		// Create children for the given node.
		this.createSubNodes( board, node );
	}

	protected createSubNodes( board: Chessboard, node: MoveNode ) {
		const moves = board.getAvailableMoves();

		for ( const move of moves ) {
			node.children.push(
				new Node(
					node,
					{
						value: 0,
						count: 0,
						move,
						visited: false,
					},
				),
			);
		}
	}

	protected pickNotVisitedRandomNode( board: Chessboard ) {
		let node = this.root!;

		while ( true ) {
			node = this.pickChildFromGivenNode( board, node );
			board = MoveController.applyMove( board, node.data.move as Move );

			if ( !node.data.visited ) {
				break;
			}
		}

		return { node, board };
	}

	protected pickChildFromGivenNode( board: Chessboard, node: MoveNode ) {
		// Get always positive values.
		// Each value represents the chance of hitting the corresponding branch.
		const values = node.children.map( child => {
			const midValue = node.data.value / ( node.data.count || 0.5 );

			return ( midValue + 125 ) / 125;
		} );

		const sum = getSum( values );

		let random = this.mathRandom();
		for ( let i = 0; i < values.length; i++ ) {
			random -= values[ i ] / sum;

			if ( random <= 0 ) {
				return node.children[ i ];
			}
		}

		throw new Error( 'End of moves - not implemented yet' );
	}
}

function getSum( arr: number[] ) {
	let sum = 0;

	for ( const value of arr ) {
		sum += value;
	}

	return sum;
}

/**
 * Estimates board value for the given player.
 *
 * TODO: Check for isDraw() and isCheckMate() optimizations.
 */
function estimateBoardValue( board: Chessboard, playerColor: number ) {
	if ( board.isDraw() ) {
		return 0;
	}

	if ( board.isCheckMate() ) {
		return -100;
	}

	let ebv = 0;

	for ( const figure of board.figures ) {
		if ( figure.color === playerColor ) {
			ebv += figureValueMap[ figure.type ];
		} else {
			ebv -= figureValueMap[ figure.type ];
		}
	}

	return ebv;
}
