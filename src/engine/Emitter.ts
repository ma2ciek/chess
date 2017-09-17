export default class Emitter<T = void> {
	private listeners: Array<(value?: T) => void> = [];

	public emit( value?: T ): void {
		this.listeners.forEach( l => l( value ) );
	}

	public subscribe( cb: (value?: T) => void) {
		this.listeners.push( cb );
	}

	public unsubscribeAll() {
		this.listeners = [];
	}
}
