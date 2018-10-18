import Chessboard from './Chessboard';
import { Move } from './utils';

export interface PlayerConstructor {
	new(): IPlayer;
}

interface IPlayer {
	readonly name: string;
	destroy?(): Promise<void> | void;
	isHuman(): boolean;
	move( board: Chessboard ): Promise<Move>;
	tryMove?( move: Move ): boolean;
}

export default IPlayer;
