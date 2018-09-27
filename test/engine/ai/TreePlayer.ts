import { expect } from 'chai';
import TreePlayer from '../../../src/engine/ai/TreePlayer';
import Chessboard from '../../../src/engine/Chessboard';

class FakeTreePlayer extends TreePlayer {
	public root = undefined;
	public mathRandom = () => 0;

	public _move( board: Chessboard ) {
		return super._move( board );
	}

	public applyFunctionDuringPeriod = ( fn: () => void ) => {
		// Doesn't invoke by default.
	}
}

describe( 'TreePlayer', () => {
	it( 'constructor', () => {
		const treePlayer = new FakeTreePlayer();

		expect( treePlayer ).to.be.an( 'object' );
	} );

	describe( '_move', () => {
		let treePlayer: FakeTreePlayer;

		beforeEach( () => {
			treePlayer = new FakeTreePlayer();
		} );

		it( 'case 1', async () => {
			const chessBoard = Chessboard.createInitialPosition();

			treePlayer.applyFunctionDuringPeriod = createCall( 1 );

			const result = await treePlayer._move( chessBoard );

			// 1 start moves.
			expect( result.counted ).to.equal( 1 );
		} );

		it( 'case 2', async () => {
			const chessBoard = Chessboard.createInitialPosition();

			treePlayer.applyFunctionDuringPeriod = createCall( 2 );

			const result = await treePlayer._move( chessBoard );

			// 2 start moves.
			expect( result.counted ).to.equal( 2 );
		} );
	} );

	function createCall<F extends () => any>( times: number ) {
		return ( fn: F ) => {
			for ( let i = 0; i < times; i++ ) {
				fn();
			}
		};
	}
} );
