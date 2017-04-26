import BoardHistory from './BoardHistory';
import FigureFactory from './FigureFactory';
import ChessFigure from './figures/ChessFigure';
import JSONFigure from './figures/JSONFigure';
import { Color } from './utils';

export default class Chessboard {
    private history: BoardHistory;
    private readonly figures: ChessFigure[];

    constructor( figures: JSONFigure[], jsonHistory: JSONHistory ) {
        this.figures = figures.map( f => FigureFactory.createFromJSON( f ) );
        this.history = new BoardHistory( jsonHistory );
    }

    public isEmptyAt( x: number, y: number ) {
        return !this.figures.some( figure => figure.x === x && figure.y === y );
    }

    public IsOpponentAt( x: number, y: number ) {
        return this.figures.some( figure => {
            return figure.x === x
                && figure.y === y
                && figure.color !== this.getTurnColor();
        } );
    }

    public getLastMove() {
        return this.history.getLastMove();
    }

    public getTurn() {
        return this.history.getTurn();
    }

    public getTurnDir() {
        return this.getTurn() === 1 ? 1 : -1;
    }

    public clone() {
        throw new Error( 'not implemented' );
    }

    public getAvailableMoves() {
        const moves = [];

        for ( const figure of this.figures ) {
            moves.push( ...figure.getAvailableMoves( this ) );
        }

        return moves.map( move => !this.isKingCheckedAfterMove( move ) );
    }

    public isCheckMate() {
        const king = this.figures.find( figure => {
            return figure.constructor.name === 'King' && figure.color === this.getTurnColor();
        } );

    }

    public isRepetitionDraw() {

    }

    private isKingCheckedAfterMove( move: any ) {

    }

    private getTurnColor(): Color {
        return this.history.getTurn() % 2;
    }
}
