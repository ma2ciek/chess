export default class Storage<P> {
	constructor( private key: string ) { }

	public get(): P | null {
		const d = localStorage.getItem( this.key );
		return d ? JSON.parse( d ) : d;
	}

	public save( data: P ) {
		localStorage.setItem( this.key, JSON.stringify( data ) );
	}
}
