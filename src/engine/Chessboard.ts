import { isEqual } from 'lodash';
import Board from './Board';
import BoardHistory from './BoardHistory';
import FigureFactory from './FigureFactory';
import ChessFigure from './figures/ChessFigure';
import JSONFigure from './figures/JSONFigure';
import King from './figures/King';
import MoveController from './MoveController';
import { Move } from './utils';

export default class Chessboard {
    public static createInitialPosition() {
        // TODO
        const figures = FigureFactory.createInitialPosition();
        return new Chessboard( figures );
    }

    public readonly id = Math.random();
    public readonly history: BoardHistory;
    public readonly figures: ReadonlyArray<ChessFigure>;

    // For speed up methods.
    private _currentKing: King;
    private _opponentKing: King;
    private _possibleMoves: ReadonlyArray<Move>;
    private _availableMoves: ReadonlyArray<Move>;
    private _board: Board;

    constructor( figures: ReadonlyArray<JSONFigure>, moves: ReadonlyArray<Move> = [] ) {
        // TODO - optimization.
        this.figures = figures.map( f => FigureFactory.createFigureFromJSON( f ) );
        this.history = new BoardHistory( moves );
    }

    public get turnColor() {
        return this.history.getTurn() % 2;
    }

    public isEmptyAt( x: number, y: number ) {
        this.assertBoardExistence();
        return !this._board.get( x, y );
    }

    public getClonedFigures(): ReadonlyArray<JSONFigure> {
        return this.figures.map( f => f.toJSON() );
    }

    public IsOpponentAt( x: number, y: number ) {
        const f = this.getFigureFrom( x, y );
        return f ? f.color !== this.turnColor : false;
    }

    public IsMyFigureAt( x: number, y: number ) {
        const f = this.getFigureFrom( x, y );
        return f ? f.color === this.turnColor : false;
    }

    public getFigureFrom( x: number, y: number ) {
        this.assertBoardExistence();
        return this._board.get( x, y );
    }

    public getLastMove() {
        return this.history.getLastMove();
    }

    public getTurn() {
        return this.history.getTurn();
    }

    public getTurnDir() {
        return this.getTurn() === 0 ? 1 : -1;
    }

    public clone() {
        throw new Error( 'not implemented' );
    }

    public isGameEnd() {
        return this.isCheckMate() || this.isDraw();
    }

    /**
     * Is current player check mated?
     */
    public isCheckMate() {
        if ( this.getAvailableMoves().length !== 0 ) {
            return false;
        }
        const emptyMove: Move = {
            type: 'fake', dest: { x: 0, y: 0 },
            figure: this.figures.find( f => f.color === this.turnColor ) as ChessFigure,
        };
        const cb = new MoveController().applyMove( this, emptyMove );

        const possibleMoves = cb.getPossibleMoves();
        const king = cb.getOpponentKing();

        if ( !king ) {
            // Because in possible moves we can drop the king.
            return false;
        }

        return possibleMoves.some( possibleMove => {
            return (
                possibleMove.dest.x === king.x &&
                possibleMove.dest.y === king.y &&
                possibleMove.type === 'capture'
            );
        } );
    }

    public isDraw() {
        return this.isNoAvailableMoveDraw() ||
            this.isThreefoldRepetitionDraw() ||
            this.isNoCaptureDraw();
    }

    public isNoAvailableMoveDraw() {
        return !this.isCheckMate() && this.getAvailableMoves().length === 0;
    }

    // https://en.wikipedia.org/wiki/Threefold_repetition#The_rule
    public isThreefoldRepetitionDraw(): boolean {
        // TODO
        return false;
    }

    public isNoCaptureDraw() {
        if ( this.history.moves.length < 100 ) {
            return false;
        }

        const lastMoves = this.history.moves.slice( -100 );

        return !lastMoves.some( move => {
            return [ 'capture', 'en-passant', 'promotion-capture' ].includes( move.type );
        } );
    }

    public isCorrectMove( move: Move ): boolean {
        return this.getAvailableMoves().some( avMove => isEqual( move, avMove ) );
    }

    /**
     * Takes care about check mates, draws, etc.
     */
    public getAvailableMoves(): ReadonlyArray<Move> {
        if ( this._availableMoves ) {
            return this._availableMoves;
        }
        const moves = this.getPossibleMoves()
            .filter( move => !this.isCurrentKingCheckedAfterMove( move ) );

        return this._availableMoves = moves;
    }

    /**
     * Sums all figures possible moves.
     */
    public getPossibleMoves(): ReadonlyArray<Move> {
        if ( this._possibleMoves ) {
            return this._possibleMoves;
        }

        const moves = [];

        for ( const figure of this.figures.filter( f => f.color === this.turnColor ) ) {
            moves.push( ...figure.getPossibleMoves( this ) );
        }

        return this._possibleMoves = moves;
    }

    public isCurrentKingCheckedAfterMove( move: Move ): boolean {
        // We virtually move king to the target position and check whether some figure can move to that place.

        // TODO: static method.
        const cb = new MoveController().applyMove( this, move );

        // We made a move, so now our king becomes opponent's king.
        const king = cb.getOpponentKing();
        const possibleMoves = cb.getPossibleMoves();

        if ( !king ) {
            // Because in possible moves we can drop the king.
            return false;
        }

        return possibleMoves.some( possibleMove => {
            return (
                possibleMove.dest.x === king.x &&
                possibleMove.dest.y === king.y &&
                possibleMove.type === 'capture'
            );
        } );
    }

    public isCurrentKingChecked() {
        const king = this.getCurrentKing();
        const possibleMoves = this.getPossibleMoves();

        return possibleMoves.some( possibleMove => {
            return (
                possibleMove.dest.x === king.x &&
                possibleMove.dest.y === king.y &&
                possibleMove.type === 'capture'
            );
        } );
    }

    private assertBoardExistence() {
        if ( !this._board ) {
            this._board = new Board( this.figures );
        }
    }

    private getCurrentKing() {
        if ( this._currentKing ) {
            return this._currentKing;
        }

        return this._currentKing = this.figures.find( figure => {
            return figure.type === 'king' && figure.color === this.turnColor;
        } ) as King;
    }

    private getOpponentKing() {
        if ( this._opponentKing ) {
            return this._opponentKing;
        }

        return this._opponentKing = this.figures.find( figure => {
            return figure.type === 'king' && figure.color !== this.turnColor;
        } ) as King;
    }
}
