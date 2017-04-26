import Node from '../src/Node';
import { expect } from 'chai';

interface IPoint {
	x: number;
	y: number;
}

describe( 'Node', () => {
	it( 'constructor()', () => {
		const node = new Node<IPoint>( null, { x: 0, y: 0 } );

		expect( node.children ).to.deep.equal( {} );
		expect( node.parent ).to.equal( null );
		expect( node.data ).to.deep.equal( { x: 0, y: 0 } );
	} );

	it( 'addChild', () => {
		const node = new Node<IPoint>( null, { x: 0, y: 0 } );
		node.addChild( 0, { x: 1, y: 2 } );

		expect( node.children[ 0 ].data ).to.deep.equal( { x: 1, y: 2 } );
		expect( node.children[ 0 ].parent ).to.equal( node );
	} );

	it( 'get', () => {
		const node = new Node<IPoint>( null, { x: 0, y: 1 } );

		expect( node.get( 'x' ) ).to.equal( 0 );
		expect( node.get( 'y' ) ).to.equal( 1 );
	} );
} );
