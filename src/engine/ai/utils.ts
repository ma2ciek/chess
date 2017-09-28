export function wait( time: number ) {
	return new Promise( res => setTimeout( res, time ) );
}

export function shuffle<T>( arr: ReadonlyArray<T> ) {
	const arr2 = arr.slice( 0 );
	const result = [];

	while ( arr2.length ) {
		const index = Math.floor( Math.random() * arr2.length );
		const [ item ] = arr2.splice( index, 1 );
		result.push( item );
	}
	return result;
}

export function applyFunctionDuringPeriod( fn: () => void, time: number ) {
	const d = Date.now();

	while ( Date.now() - d < time ) {
		fn();
	}
}
