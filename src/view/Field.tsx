import * as React from 'react';

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
	x: number;
	y: number;
	tileSize: number;
	highlighted: boolean;
	selected: boolean;
}

export default class Field extends React.Component<FieldProps> {
	public render() {
		const { x, y, tileSize, highlighted, selected, ...props } = this.props;
		const odd = ( x + y ) % 2 === 1;

		const color = odd ? 'white' : 'black';
		const highlightedClass = highlighted ? 'highlighted' : '';
		const selectedClass = selected ? 'selected' : '';

		const className = `field ${ color } ${ highlightedClass } ${ selectedClass }`;

		const style = {
			top: tileSize * 7 - y * tileSize,
			left: x * tileSize,
			width: tileSize,
			height: tileSize,
		};

		return (
			<div className={ className } style={ { ...style } } { ...props }></div>
		);
	}
}
