import * as React from 'react';
import getMoveSymbol from '../engine/getMoveSymbol';
import { Move } from '../engine/utils';

interface MoveListProps {
	history: Move[];
	onClick: ( moveIndex: number ) => void;
}

export default class MoveList extends React.Component<MoveListProps> {
	public render() {
		return (
			<div className='move-list'>
				<table>
					<tbody>
						{ this.getMoveArr() }
					</tbody>
				</table>
			</div>
		);
	}

	private getMoveArr() {
		const { history, onClick } = this.props;

		const movesArr: JSX.Element[] = [];

		for ( let i = 0; i < history.length; i += 2 ) {
			const index = i / 2 + 1;

			movesArr.push(
				<tr key={ index }>
					<td>{ index }</td>
					<td onClick={ () => onClick( i ) }>{ getMoveSymbol( history[ i ] ) } </td>
					<td onClick={ () => onClick( i + 1 ) }>{ history[ i + 1 ] ? getMoveSymbol( history[ i + 1 ] ) : '' }</td>
				</tr>,
			);
		}

		return movesArr;
	}
}
