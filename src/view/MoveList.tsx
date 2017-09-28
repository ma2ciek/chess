import * as React from 'react';
import { BoardHistory } from '../engine/Engine';
import getMoveSymbol from '../engine/getMoveSymbol';

interface MoveListProps {
	history: BoardHistory;
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
		const { history } = this.props;

		const moves = history.moves;
		const movesArr: JSX.Element[] = [];

		for ( let i = 0; i < moves.length; i += 2 ) {
			const index = i / 2 + 1;

			movesArr.push(
				<tr key={ index }>
					<td>{ index }</td>
					<td>{ getMoveSymbol( moves[ i ] ) } </td>
					<td>{ moves[ i + 1 ] ? getMoveSymbol( moves[ i + 1 ] ) : '' }</td>
				</tr>,
			);
		}

		return movesArr;
	}
}