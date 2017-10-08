import { isEqual } from 'lodash';
import Board from './Board';
import BoardHistory from './BoardHistory';
import FigureFactory from './FigureFactory';
import ChessFigure from './figures/ChessFigure';
import King from './figures/King';
import MoveController from './MoveController';
import { Color, FigureTypes, JSONFigure, Move, MoveTypes } from './utils';

export default class Chessboard {
    public static createInitialPosition() {
        const figures = FigureFactory.createInitialPosition();

        return Chessboard.fromExistingFigures( figures, [] );
    }

    public static fromExistingFigures( figures: ReadonlyArray<ChessFigure>, historyMoves: ReadonlyArray<Move> ) {
        const history = new BoardHistory( historyMoves );
        const board = Board.fromFigures( figures );

        return new Chessboard( figures, board, history );
    }

    public static fromExistingFiguresAndBoard( figures: ReadonlyArray<ChessFigure>, board: Board, historyMoves: ReadonlyArray<Move> ) {
        const history = new BoardHistory( historyMoves );

        return new Chessboard( figures, board, history );
    }

    public static fromJSON( jsonFigures: ReadonlyArray<JSONFigure>, historyMoves: ReadonlyArray<Move> = [] ) {
        const figures = FigureFactory.createFromJSON( jsonFigures );
        const board = Board.fromFigures( figures );
        const history = new BoardHistory( historyMoves );

        return new Chessboard( figures, board, history );
    }

    // For speed up methods.
    private _currentKing: King;
    private _opponentKing: King;
    private _possibleMoves: ReadonlyArray<Move>;
    private _availableMoves: ReadonlyArray<Move>;

    constructor(
        public readonly figures: ReadonlyArray<ChessFigure>,
        public readonly board: Board,
        public readonly history: BoardHistory,
    ) { }

    public get turnColor() {
        return this.history.getTurn() % 2;
    }

    public isEmptyAt( x: number, y: number ) {
        return !this.board.get( x, y );
    }

    public getClonedFigures(): ReadonlyArray<JSONFigure> {
        return this.figures.map( f => f.toJSON() );
    }

    public isOpponentAt( x: number, y: number ) {
        const f = this.getFigureFrom( x, y );
        return f ? f.color !== this.turnColor : false;
    }

    public getFigureFrom( x: number, y: number ) {
        return this.board.get( x, y );
    }

    public getLastMove() {
        return this.history.getLastMove();
    }

    public getTurn() {
        return this.history.getTurn();
    }

    public getTurnDir() {
        return this.getTurn() === Color.White ? 1 : -1;
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

        const cb = MoveController.applyFakeMove( this );

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
                possibleMove.type === MoveTypes.CAPTURE
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
            return [ MoveTypes.CAPTURE, MoveTypes.EN_PASSANT, MoveTypes.PROMOTION_CAPTURE ].includes( move.type );
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
        const cb = MoveController.applyMove( this, move );

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
                possibleMove.type === MoveTypes.CAPTURE
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
                possibleMove.type === MoveTypes.CAPTURE
            );
        } );
    }

    public getBoardSymbol() {
        return this.history.moves.length + this.board.toString();
    }

    public get turn() {
        return this.history.moves.length;
    }

    private getCurrentKing() {
        if ( this._currentKing ) {
            return this._currentKing;
        }

        return this._currentKing = this.figures.find( figure => {
            return figure.type === FigureTypes.KING && figure.color === this.turnColor;
        } ) as King;
    }

    private getOpponentKing() {
        if ( this._opponentKing ) {
            return this._opponentKing;
        }

        return this._opponentKing = this.figures.find( figure => {
            return figure.type === FigureTypes.KING && figure.color !== this.turnColor;
        } ) as King;
    }
}
