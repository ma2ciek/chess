export { default as Chessboard } from './Chessboard';
export { default as AIPlayer } from './AIPlayer';
export { default as IPlayer, PlayerConstructor } from './IPlayer';
export { default as Game } from './Game';
export { default as HumanPlayer } from './HumanPlayer';
export { default as ChessFigure } from './figures/ChessFigure';
export { default as BoardHistory } from './BoardHistory';
export { default as SimpleAIPlayer } from './SimpleAIPlayer';

// import AIPlayer from './AIPlayer';
import HumanPlayer from './HumanPlayer';
import SimpleAIPlayer from './SimpleAIPlayer';

import { PlayerConstructor } from './IPlayer';

export interface PlayerConstructorDictionary {
	[ name: string ]: PlayerConstructor;
}

export const Players: PlayerConstructorDictionary = {
	HumanPlayer,
	// AIPlayer,
	SimpleAIPlayer,
};
