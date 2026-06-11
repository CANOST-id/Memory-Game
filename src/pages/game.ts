import { cardImages, cardTemplate } from '../services/cards';
import { gameOver } from '../services/navigation';
import { loadGameSettings, saveGameResult } from '../services/local-storage';
import {
    CardModel,
    GameState,
    GameResult,
    Winner,
    PlayerColor,
    TurnHooks
} from '../services/interfaces';

/** 
 * Checks if the current page is the game page and initializes the game board.
 */
if (document.querySelector('.game')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
}

/**
 * Load game settings from local storage and initialize the game board.
 */
function initGame() {
    let settings = loadGameSettings();
    let themeClass = applyTheme(settings.theme);
    createGameBoard(settings.boardSize, themeClass, settings.player);
}

/**
 * Applies selected theme by adding CSS class to the body element. Replaces previous applied theme class.
 * @param theme - The name of the selected theme from settings.
 * @returns The CSS class name of the applied theme.
 */
export function applyTheme(theme: string) {
    let themeMap: Record<string, string> = {
        'Code vibes theme': 'code-vibes',
        'Gaming theme': 'games-theme'
    };

    let themeClass = themeMap[theme];
    Object.values(themeMap).forEach(cls => document.body.classList.remove(cls));
    if (themeClass) document.body.classList.add(themeClass);
    return themeClass;
}

/**
 * Initializes the game board based on current settings.
 * @param boardSize - Boardsize as a Number or String.
 * @returns The normalized board size.
 */
function normalizeBoardSize(boardSize: number | string): number {
    const parsed = parseInt(String(boardSize), 10);
    return Number.isFinite(parsed) ? parsed : 16;
}

/**
 * Applies the starting player color.
 * @param player - The name of the starting player from settings.
 * @returns `'Blue'` or `'Orange'` as {@link PlayerColor}.
 */
function resolveStartPlayer(player: string): PlayerColor {
    return player === 'Blue' ? 'Blue' : 'Orange';
}

/**
 * Returns image paths for the selected theme, limited to the required number of pairs.
 * @param theme - CSS class name of the theme.
 * @param pairCount - Number of required card pairs.
 * @param cardImages - Mapping from theme names to image paths.
 * @returns Array with `pairCount` image paths.
 * @throws {Error} If there are not enough images for the selected options.
 */
function getThemeImages(theme: string, pairCount: number, cardImages: Record<string, string[]>): string[] {
    let images = cardImages[theme] || [];
    if (images.length < pairCount) {
        throw new Error(`Not enough card images for theme "${theme}". Needed: ${pairCount}, available: ${images.length}`);
    }
    return images.slice(0, pairCount);
}

/**
 * Creates two {@link CardModel}-objects for each image.
 * @param images - Array of image paths.
 * @returns All cards pairs as a {@link CardModel}- array.
 */
function buildPairs(images: string[]): CardModel[] {
    return images.flatMap((img, pairIndex) => ([
        { id: pairIndex * 2, pairIndex, imgSrc: img },
        { id: pairIndex * 2 + 1, pairIndex, imgSrc: img }
    ]));
}

/**
 * Shuffles the current deck of cards. 
 * @param deck - The {@link CardModel}- array to shuffle.
 * @returns Shuffled {@link CardModel}- array.
 */
function shuffleDeck(deck: CardModel[]): CardModel[] {
    return deck.sort(() => Math.random() - 0.5);
}

/**
 * Create an indexed and shuffled array of card pairs.
 * @param theme - CSS class name of the theme.
 * @param boardSize - Total number of current cards.
 * @returns Shuffled {@link CardModel}- array.
 */
function createIndexedPairs(theme: string, boardSize: number): CardModel[] {
    let pairCount = boardSize / 2;
    let images = getThemeImages(theme, pairCount, cardImages);
    return shuffleDeck(buildPairs(images));
}

/**
 * Creates initial {@link GameState} for a new game.
 * @param size - Total number of cards on the board.
 * @param startPlayer - Name of starting player.
 * @returns A new {@link GameState} object.
 */
function createGameState(size: number, startPlayer: string): GameState {
    return {
        openCards: [],
        lockBoard: false,
        currentPlayer: resolveStartPlayer(startPlayer),
        matchedPairs: 0,
        totalPairs: size / 2,
        orangeScore: 0,
        blueScore: 0
    };
}

/**
 * Updates the score display for each player.
 * @param player - The {@link PlayerColor} current player score.
 * @param score - The new score.
 */
function updateScoreElements(player: PlayerColor, score: number) {
    let colorClass = player === 'Orange' ? '--orange' : '--blue';
    let cvScore = document.querySelector(`.standings .--cv-standings.${colorClass} .--score`) as HTMLElement | null;
    let gtScore = document.querySelector(`.standings .--gt-standings.${colorClass} p`) as HTMLElement | null;
    if (cvScore) cvScore.textContent = String(score);
    if (gtScore) gtScore.textContent = String(score);
}

/**
 * Renders the current score of both players.
 * @param state - The current {@link GameState}.
 */
function renderStandings(state: GameState) {
    updateScoreElements('Blue', state.blueScore);
    updateScoreElements('Orange', state.orangeScore);
}

/**
 * Creates a card element with data attributes and event listiners.
 * @param cardData - The  {@link CardModel}- data of the card.
 * @param theme - CSS- class names of the current theme.
 * @param state - The current  {@link GameState} game state.
 * @returns The completed `div` element of the card.
 */
function createCardElement(cardData: CardModel, theme: string, state: GameState): HTMLElement {
    let card = document.createElement('div');
    card.classList.add('card');
    card.dataset['pairIndex'] = String(cardData.pairIndex);
    card.dataset['cardId'] = String(cardData.id);
    card.innerHTML = cardTemplate(theme, cardData.imgSrc);
    card.addEventListener('click', () => onCardClick(card, state));
    return card;
}

/**
 * Renders all cards of the deck onto the game table.
 * @param table - The container element of the game table.
 * @param deck - The already shuffled {@link CardModel}-Array.
 * @param theme - CSS class names of the current theme.
 * @param state - The current {@link GameState} game state.
 */
function renderDeck(table: HTMLElement, deck: CardModel[], theme: string, state: GameState) {
    deck.forEach(cardData => table.appendChild(createCardElement(cardData, theme, state)));
}

/**
 * Initializes the game table and renders elements.
 * @param boardSize - The number of cards as a Number or String.
 * @param theme - CSS class names of the current theme.
 * @param startPlayerFromSettings - The name of the starting player from the settings.
 */
function createGameBoard(boardSize: number | string, theme: string, startPlayerFromSettings: string) {
    let table = document.querySelector('.game__table') as HTMLElement | null;
    if (!table) return;
    table.innerHTML = '';
    let size = normalizeBoardSize(boardSize);
    table.dataset['size'] = String(size);
    let state = createGameState(size, startPlayerFromSettings);
    renderCurrentPlayer(state.currentPlayer);
    renderStandings(state);
    renderDeck(table, createIndexedPairs(theme, size), theme, state);
}

/**
 * Checks if a card can be flipped.
 * @param card - The card element.
 * @param state - The current {@link GameState} game state.
 * @returns `true` if the card can be flipped, else `false`.
 */
function canFlipCard(card: HTMLElement, state: GameState): boolean {
    if (state.lockBoard) return false;
    if (card.classList.contains('card--flipped')) return false;
    if (card.classList.contains('card--matched')) return false;
    return true;
}

/**
 * Click handler for each card:
 * - Checks if the card can be flipped and flips it.
 * - Resolves if two open cards match to each other 
 * @param card - The clicked card element.
 * @param state - The current {@link GameState} game state.
 */
function onCardClick(card: HTMLElement, state: GameState) {
    if (!canFlipCard(card, state)) return;
    card.classList.add('card--flipped');
    state.openCards.push(card);
    if (state.openCards.length < 2) return;
    state.lockBoard = true;
    resolveOpenCards(state, {
        onMatch: (cards, player) => handleMatch(state, cards, player),
        onMismatch: (cards) => handleMismatch(state, cards)
    });
}

/**
 * Handles matching cards and adds a point to the current player.
 * @param state - The current {@link GameState} game state.
 * @param cards - The two matching card elements.
 * @param player - The {@link PlayerColor} of the player who found the pair.
 */
function handleMatch(state: GameState, cards: [HTMLElement, HTMLElement], player: PlayerColor) {
    markCardsAsMatched(cards, player);
    addPoint(state, player);
    state.matchedPairs += 1;
    if (state.matchedPairs === state.totalPairs) {
        saveGameResult(state);
        window.setTimeout(() => {
            gameOver();
        }, 2000);
    }
    finishTurn(state, false);
}

/**
 * Handles a card mismatch.
 * @param state - The current {@link GameState} game state.
 * @param cards - The two non-matching card elements.
 */
function handleMismatch(state: GameState, cards: [HTMLElement, HTMLElement]) {
    window.setTimeout(() => {
        cards.forEach(card => card.classList.remove('card--flipped'));
        finishTurn(state, true);
    }, 850);
}

/**
 * Compares the two flipped cards and handles the result.
 * @param state - The current {@link GameState} game state.
 * @param hooks - {@link TurnHooks} with callbacks for match and mismatch.
 */
function resolveOpenCards(state: GameState, hooks: TurnHooks) {
    let [first, second] = state.openCards as [HTMLElement, HTMLElement];
    let samePair = first.dataset['pairIndex'] === second.dataset['pairIndex'];
    if (samePair) {
        hooks.onMatch([first, second], state.currentPlayer);
        return;
    }
    hooks.onMismatch([first, second]);
}

/**
 * Adds the `card--matched`- class and the current player class to the matched cards.
 * @param cards - Two matching card elements.
 * @param player - The {@link PlayerColor} of the player who found the pair.
 */
function markCardsAsMatched(cards: [HTMLElement, HTMLElement], player: PlayerColor) {
    let playerClass = player === 'Orange' ? 'card--matched-orange' : 'card--matched-blue';

    cards.forEach(card => {
        card.classList.add('card--matched');
        card.classList.add(playerClass);
    });
}

/**
 * Resets the open cards, unlocks the board and switches the player.
 * @param state - The current {@link GameState} game state.
 * @param switchPlayer - If `true`, switches to the next player.
 */
function finishTurn(state: GameState, switchPlayer: boolean) {
    state.openCards = [];
    state.lockBoard = false;

    if (switchPlayer) {
        state.currentPlayer = nextPlayer(state.currentPlayer);
        renderCurrentPlayer(state.currentPlayer);
    }
}

/**
 * Updates the score of the specified player by + 1.
 * @param state - The current {@link GameState}.
 * @param player - The {@link PlayerColor} of the player receiving a point.
 */
function addPoint(state: GameState, player: PlayerColor) {
    if (player === 'Orange') state.orangeScore += 1;
    if (player === 'Blue') state.blueScore += 1;
    renderStandings(state);
}

/**
 * Switches to the next player after a turn is completed.
 * @param player - The current Player {@link PlayerColor}.
 * @returns The next Player {@link PlayerColor}.
 */
function nextPlayer(player: PlayerColor): PlayerColor {
    return player === 'Orange' ? 'Blue' : 'Orange';
}

/**
 * Returns the CSS class for the player indicator based on the active theme.
 * @returns `'indicator--pawn'` for the gaming theme, otherwise `'indicator--label'`.
 */
function getIndicatorVariant(): string {
    let isGamesTheme = document.body.classList.contains('games-theme');
    return isGamesTheme ? 'indicator--pawn' : 'indicator--label';
}

/**
 * Updates the player indicator for the current player.
 * @param player - The current {@link PlayerColor} Player.
 */
function renderCurrentPlayer(player: PlayerColor) {
    let indicator = document.querySelector('.current-player__indicator') as HTMLElement | null;
    if (!indicator) return;

    indicator.className = 'current-player__indicator';
    indicator.classList.add(getIndicatorVariant());
    indicator.classList.add(player === 'Orange' ? 'is-orange' : 'is-blue');
}

/**
 * Gets the winner based on the final score.
 * @param state - The completed {@link GameState} game state.
 * @returns `'Orange'`, `'Blue'` or `'Draw'` as {@link Winner}.
 */
function resolveWinner(state: GameState): Winner {
    if (state.orangeScore > state.blueScore) return 'Orange';
    if (state.blueScore > state.orangeScore) return 'Blue';
    return 'Draw';
}

/**
 * Creates a {@link GameResult} object from the final game state.
 * @param state - The state of the completed {@link GameState} game.
 * @returns the complete {@link GameResult} game result.
 */
export function buildGameResult(state: GameState): GameResult {
    return {
        winner: resolveWinner(state),
        orangeScore: state.orangeScore,
        blueScore: state.blueScore
    };
}