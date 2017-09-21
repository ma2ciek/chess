export { default as Chessboard } from './Chessboard';
export { default as AIPlayer } from './AIPlayer';
export { default as IPlayer, PlayerConstructor } from './IPlayer';
export { default as Game } from './Game';
export { default as HumanPlayer } from './HumanPlayer';
export { default as ChessFigure } from './figures/ChessFigure';
export { default as BoardHistory } from './BoardHistory';
export { default as SimpleAIPlayer } from './ai/SimpleAIPlayer';
export { Move } from './utils';

// import AIPlayer from './AIPlayer';
import A4MoveAIPlayer from './ai/A4MoveAIPlayer';
import SimpleAIPlayer from './ai/SimpleAIPlayer';
import SimpleAIPlayerMultiThread from './ai/SimpleAIPlayerMultiThread';
import HumanPlayer from './HumanPlayer';

import { PlayerConstructor } from './IPlayer';

export interface PlayerConstructorDictionary {
	[ name: string ]: PlayerConstructor;
}

export const Players: PlayerConstructorDictionary = {
	HumanPlayer,
	// AIPlayer,
	A4MoveAIPlayer,
	SimpleAIPlayer,
	SimpleAIPlayerMultiThread,
};
