import { expect } from 'chai';
import * as sinon from 'sinon';
import BoardValueEstimator from '../../../src/engine/ai/BoardValueEstimator';
import { createChessBoardAtInitialPosition } from '../../../src/engine/board-utils';

describe( 'BoardValueEstimator', () => {
	afterEach( () => {
		sinon.restore();
	} );

	it( 'constructor()', () => {
		const b = new BoardValueEstimator();

		expect( b ).to.be.an( 'object' );
	} );

	it( 'should not memoize and add randomness', () => {
		sinon.stub( Math, 'random' )
			.onFirstCall().returns( 0 )
			.onSecondCall().returns( 1 );

		const b = new BoardValueEstimator();

		const cb = createChessBoardAtInitialPosition();

		const value = b.estimateValue( cb );
		const value2 = b.estimateValue( cb );

		expect( value ).to.not.equal( value2 );
	} );

	it( 'should return the same value without randomness', () => {
		sinon.stub( Math, 'random' ).returns( 0 );

		const b = new BoardValueEstimator();

		const cb = createChessBoardAtInitialPosition();

		const value = b.estimateValue( cb );
		const value2 = b.estimateValue( cb );

		expect( value ).to.equal( value2 );
	} );
} );
