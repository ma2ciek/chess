import Chessboard from './Chessboard';
import IPlayer from './IPlayer';
import Node from './Node';
// import RandomMover from './RandomMover';
import { Move } from './utils';

interface INodeData {
	value: number;
	hits: number;
}

export default class AIPlayer implements IPlayer {
	private tree: Node<INodeData>;

	public isHuman() {
		return false;
	}

	public move( board: Chessboard ) {
		return new Promise<Move>( ( res, rej ) => {
			this.createMoveTree();

			const t = Date.now();

			while ( Date.now() - t < 100 ) {
				this.makeRandomMoves( board );
			}

			const move = this.getBestMove( board );

			res( move );
		} );
	}

	private makeRandomMoves( board: Chessboard ) {
		// new RandomMover(
		// 	this.tree,
		// 	board.clone(),
		// ).move();
	}

	private createMoveTree() {
		this.tree = new Node( null, {
			hits: 0,
			value: 0,
		} );
	}

	private getBestMove( board: Chessboard ) {
		const moves = board.getAvailableMoves();

		let bestMove = -Infinity;
		let bestIndex = 0;

		for ( const moveIndex in this.tree.children ) {
			const node = this.tree.children[ moveIndex ];

			if ( node.data.value > bestMove ) {
				bestMove = node.data.hits;
				bestIndex = +moveIndex;
			}
		}

		return moves[ bestIndex ];
	}
}
