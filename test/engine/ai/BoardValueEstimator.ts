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
} );
