export default class Node<T extends object> {
	public readonly parent: Node<T> | null;
	public readonly data: T;
	public readonly children: Array<Node<T>> = [];

	constructor( parent: Node<T> | null, data: T ) {
		this.parent = parent;
		this.data = data;
		this.children = [];
	}

	public toJSON(): {} {
		return {
			data: this.data,
			children: this.children.map( c => c.toJSON() ),
		};
	}
}
