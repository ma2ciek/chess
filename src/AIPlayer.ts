import Chessboard from './Chessboard';
import Node from './Node';
import RandomMover from './RandomMover';

interface INodeData {
	value: number;
	hits: number;
}

export default class AIPlayer {
	private tree: Node<INodeData>;

	constructor() {

	}

	public move( board: Chessboard ) {
		return new Promise(( res, rej ) => {
			this.createMoveTree();

			const t = Date.now();

			while ( Date.now() - t < 100 ) {
				this.makeRandomMoves( board );
			}

			const move = this.getBestMove( board );

			res( move );
		} );
	}

	public makeRandomMoves( board: Chessboard ) {
		new RandomMover(
			this.tree,
			board.clone(),
		).move();
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
		let bestIndex: number;

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
