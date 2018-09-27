import { expect } from 'chai';
import BoardValueEstimator from '../../../src/engine/ai/BoardValueEstimator';
import { Chessboard } from '../../../src/engine/Engine';

describe( 'BoardValueEstimator', () => {
	it( 'constructor()', () => {
		const b = new BoardValueEstimator();

		expect( b ).to.be.an( 'object' );
	} );

	it( 'memoization', () => {
		const b = new BoardValueEstimator();

		const cb = Chessboard.createInitialPosition();

		const value = b.estimateValue( cb );
		const value2 = b.estimateValue( cb );

		expect( value ).to.equal( value2 );
	} );

	describe( 'includes()', () => {
		it( 'should returns true if the value is memoized', () => {
			const b = new BoardValueEstimator();

			const cb = Chessboard.createInitialPosition();
			b.estimateValue( cb );

			expect( b.includes( cb ) ).to.be.true;
		} );

		it( 'should returns false if the value is not memoized', () => {
			const b = new BoardValueEstimator();

			const cb = Chessboard.createInitialPosition();

			expect( b.includes( cb ) ).to.be.false;
		} );
	} );

	// describe( 'various positions', () => {
	// 	const position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

	// 	const board = Chessboard.fromPosition( position );

	// })
} );