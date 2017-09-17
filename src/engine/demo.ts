import Game from './Game';
import HumanPlayer from './HumanPlayer';

const h1 = new HumanPlayer();
const h2 = new HumanPlayer();

const game = new Game( [ h1, h2 ] );

game.start();
