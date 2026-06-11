export type Winner = PlayerColor | 'Draw';
export type PlayerColor = 'Orange' | 'Blue';

export interface Settings {
    theme: string;
    player: string;
    boardSize: number | string;
}

export interface CardModel {
    id: number;
    pairIndex: number;
    imgSrc: string;
}

export interface GameState {
    openCards: HTMLElement[];
    lockBoard: boolean;
    currentPlayer: PlayerColor;
    matchedPairs: number;
    totalPairs: number;
    orangeScore: number;
    blueScore: number;
}

export interface GameResult {
    winner: Winner;
    orangeScore: number;
    blueScore: number;
}

export interface TurnHooks {
    onMatch: (cards: [HTMLElement, HTMLElement], player: PlayerColor) => void;
    onMismatch: (cards: [HTMLElement, HTMLElement]) => void;
}