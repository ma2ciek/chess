import { expect } from 'chai';
import MCTSPlayer from '../../../src/engine/ai/MCTSPlayer';
import { createChessBoardAtInitialPosition } from '../../../src/engine/board-utils';
import Chessboard from '../../../src/engine/Chessboard';

class FakeMCTSPlayer extends MCTSPlayer {
	public root = undefined;
	public mathRandom = () => 0;

	public _move( board: Chessboard ) {
		return super._move( board );
	}

	public applyFunctionDuringPeriod = ( fn: () => void ) => {
		// Doesn't invoke by default.
	}
}

describe( 'MCTSPlayer', () => {
	it( 'constructor', () => {
		const mctsPlayer = new FakeMCTSPlayer();

		expect( mctsPlayer ).to.be.an( 'object' );
	} );

	describe( '_move', () => {
		let mctsPlayer: FakeMCTSPlayer;

		beforeEach( () => {
			mctsPlayer = new FakeMCTSPlayer();
		} );

		it( 'case 1', async () => {
			const chessBoard = createChessBoardAtInitialPosition();

			mctsPlayer.applyFunctionDuringPeriod = createCall( 1 );

			const result = await mctsPlayer._move( chessBoard );

			// 1 start moves.
			expect( result.counted ).to.equal( 1 );
		} );

		it( 'case 2', async () => {
			const chessBoard = createChessBoardAtInitialPosition();

			mctsPlayer.applyFunctionDuringPeriod = createCall( 2 );

			const result = await mctsPlayer._move( chessBoard );

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
