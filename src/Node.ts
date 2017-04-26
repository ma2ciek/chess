export default class Node<T extends object> {
	public readonly parent: Node<T>;
	public readonly data: T;
	public readonly children: {
		[ index: number ]: Node<T>;
	} = {};

	constructor( parent: Node<T>, data: T ) {
		this.parent = parent;
		this.data = data;
	}

	public addChild( index: number, data: T ) {
		this.children[ index ] = new Node( this, data );
	}

	public get<P extends keyof T>( key: P ) {
		return this.data[ key ];
	}

	public set<P extends keyof T>( key: P, value: T[P] ) {
		this.data[ key ] = value;
	}
}
