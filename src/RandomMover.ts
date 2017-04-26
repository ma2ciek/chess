import Chessboard from './Chessboard';
import Node from './Node';

interface INodeData {
	value: number;
	hits: number;
}

export default class RandomMover {
	private board: Chessboard;
	private gameHistoryNode: Node<INodeData>;

	public constructor(
		tree: Node<INodeData>,
		board: any,
	) {
		this.gameHistoryNode = tree;
		this.board = board;
	}

	public move() {
		while ( true ) {
			const moves = this.board.getAvailableMoves();

			if ( moves.length === 0 ) {
				break;
			}

			const { pickedMove, moveIndex } = this.pickMove( moves );

			this.addMoveToTree( moveIndex );
			this.gameHistoryNode = this.gameHistoryNode.children[ moveIndex ];

			this.board.addMove( pickedMove );

			if ( this.gameHistoryNode.data.hits === 0 ) {
				break;
			}
		}

		const moveValue = this.getCurrentBoardValue();

		this.applyMoveValueToSubNodes( moveValue );
	}

	private pickMove( moves ) {
		return {
			pickedMove: moves[ 0 ],
			moveIndex: 0,
		};
	}

	private addMoveToTree( moveIndex: number ) {
		this.gameHistoryNode.addChild( moveIndex, { hits: 0, value: 0 } );
	}

	private applyMoveValueToSubNodes( moveValue: number ) {
		let node = this.gameHistoryNode;

		while ( node !== null ) {
			const data = node.data;
			data.value = ( data.value * data.hits + moveValue ) / ( data.hits + 1 );
			node = node.parent;
		}
	}

	private getBoardValue() {

	}
}
