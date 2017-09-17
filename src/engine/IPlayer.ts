import Chessboard from './Chessboard';
import { IMove } from './utils';

export interface PlayerConstructor {
	new(): IPlayer;
}

interface IPlayer {
	isHuman(): boolean;
	move( board: Chessboard ): Promise<IMove>;
}

export default IPlayer;
