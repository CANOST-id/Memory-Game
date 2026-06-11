export type Winner = PlayerColor | 'Draw';
export type PlayerColor = 'Orange' | 'Blue';

/**
 * Interface representing the game settings selected by the user.
 * @param theme - The selected game theme.
 * @param player - The selected player color.
 * @param boardSize - The selected board size, which can be a number or a string representation of the size.
 */
export interface Settings {
    theme: string;
    player: string;
    boardSize: number | string;
}

/**
 * Interface representing a card in the memory game.
 * @param id - A unique identifier for the card.
 * @param pairIndex - An index representing the pair to which the card belongs, used for matching logic.
 * @param imgSrc - The source URL of the image displayed on the card.
 */
export interface CardModel {
    id: number;
    pairIndex: number;
    imgSrc: string;
}

/**
 * Interface representing the current state of the game.
 * @param openCards - An array of currently flipped cards that are being compared for a match.
 * @param lockBoard - A boolean indicating the state of the board. Used when two cards are flipped.
 * @param currentPlayer - The color of the current player, which can be 'Orange' or 'Blue'.
 * @param matchedPairs - The number of pairs that have been successfully matched so far.
 * @param totalPairs - The total number of pairs in the game, which is determined by the board size.
 * @param orangeScore - The score of the orange player.
 * @param blueScore - The score of the blue player.
 */
export interface GameState {
    openCards: HTMLElement[];
    lockBoard: boolean;
    currentPlayer: PlayerColor;
    matchedPairs: number;
    totalPairs: number;
    orangeScore: number;
    blueScore: number;
}

/**
 * Interface representing the result of a game.
 * @param winner - The winner of the game.
 * @param orangeScore - The final score of the orange player.
 * @param blueScore - The final score of the blue player.
 */
export interface GameResult {
    winner: Winner;
    orangeScore: number;
    blueScore: number;
}

/**
 * Interface representing hooks for turn events.
 * @param onMatch - Callback function invoked when a match is found.
 * @param onMismatch - Callback function invoked when a mismatch occurs.
 */
export interface TurnHooks {
    onMatch: (cards: [HTMLElement, HTMLElement], player: PlayerColor) => void;
    onMismatch: (cards: [HTMLElement, HTMLElement]) => void;
}