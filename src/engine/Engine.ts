export { default as Chessboard } from './Chessboard';
export { default as AIPlayer } from './ai/AIPlayer';
export { default as IPlayer, PlayerConstructor } from './IPlayer';
export { default as Game } from './Game';
export { default as HumanPlayer } from './HumanPlayer';
export { default as ChessFigure } from './figures/ChessFigure';
export { default as SimpleAIPlayer } from './ai/SimpleAIPlayer';
export { default as RandomAIPlayer } from './ai/RandomAIPlayer';
export { Move } from './utils';

import * as _fenParser from './fenParser';
export const fenParser = _fenParser;

import SimpleAIPlayer from './ai/SimpleAIPlayer';
import RandomAIPlayer from './ai/RandomAIPlayer';
import SimpleAIPlayerMultiThread from './ai/SimpleAIPlayerMultiThread';
import NMovePlayerMultiThread from './ai/NMovePlayerMultiThread';
import NMovePlayer from './ai/NMovePlayer';
import HumanPlayer from './HumanPlayer';

import { PlayerConstructor } from './IPlayer';

export interface PlayerConstructorDictionary {
	[ name: string ]: PlayerConstructor;
}

export const Players: PlayerConstructorDictionary = {};

const PlayerConstructors = [
	HumanPlayer,
	NMovePlayerMultiThread,
	NMovePlayer,
	SimpleAIPlayer,
	RandomAIPlayer,
	SimpleAIPlayerMultiThread,
];

for ( const Player of PlayerConstructors ) {
	Players[ Player.name ] = Player;
}
