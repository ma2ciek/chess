import * as React from 'react';
import { ChessFigure } from '../engine/Engine';

interface FigureProps extends React.HTMLAttributes<HTMLDivElement> {
	figure: ChessFigure;
	tileSize: number;
}

export default class Figure extends React.Component<FigureProps, {}> {
	public render() {
		const { figure, tileSize, ...props } = this.props;
		const color = figure.color === 0 ? 'white' : 'black';

		const className = `figure ${ figure.type } ${ color }`;
		const style = {
			top: tileSize * 7 - figure.y * tileSize,
			left: figure.x * tileSize,
			width: tileSize,
			height: tileSize,
		};

		return (
			<div className={ className } style={ { ...style } } { ...props }></div>
		);
	}
}
