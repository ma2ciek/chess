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

import MCTSPlayer from './ai/MCTSPlayer';
import NMovePlayer from './ai/NMovePlayer';
import NMovePlayerMultiThread from './ai/NMovePlayerMultiThread';
import RandomAIPlayer from './ai/RandomAIPlayer';
import SimpleAIPlayer from './ai/SimpleAIPlayer';
import SimpleAIPlayerMultiThread from './ai/SimpleAIPlayerMultiThread';
import HumanPlayer from './HumanPlayer';

import { PlayerConstructor } from './IPlayer';

export interface PlayerConstructorDictionary {
	[ name: string ]: PlayerConstructor;
}

export const Players: PlayerConstructorDictionary = {};

const PlayerConstructors: PlayerConstructor[] = [
	HumanPlayer,
	MCTSPlayer,
	NMovePlayerMultiThread,
	NMovePlayer,
	SimpleAIPlayer,
	RandomAIPlayer,
	SimpleAIPlayerMultiThread,
];

for ( const Player of PlayerConstructors ) {
	// TODO - name should be public static member.
	Players[ Player.playerName ] = Player;
}
