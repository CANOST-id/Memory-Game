import { cardImages, cardTemplate } from '../services/cards';
import { gameOver } from '../services/navigation';
import { loadGameSettings, safeGameResult } from '../services/local-storage';
import {
    CardModel,
    GameState,
    GameResult,
    Winner,
    PlayerColor,
    TurnHooks } from '../services/interfaces';

// Initialize the game when the page is loaded
if (document.querySelector('.game')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
}

// Initialize the game by loading settings, applying theme, creating the game board, and 
function initGame() {
    let settings = loadGameSettings();
    let themeClass = applyTheme(settings.theme);
    createGameBoard(settings.boardSize, themeClass, settings.player);
}

// apply the selected theme 
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

function normalizeBoardSize(boardSize: number | string): number {
    const parsed = parseInt(String(boardSize), 10);
    return Number.isFinite(parsed) ? parsed : 16;
}

// resolve the starting player based on the settings
function resolveStartPlayer(player: string): PlayerColor {
    return player === 'Blue' ? 'Blue' : 'Orange';
}

// switch to the next player after a turn is finished
function nextPlayer(player: PlayerColor): PlayerColor {
    return player === 'Orange' ? 'Blue' : 'Orange';
}

// get theme images based on selscted theme and the number of cards
function getThemeImages(theme: string, pairCount: number, cardImages: Record<string, string[]>): string[] {
    let images = cardImages[theme] || [];
    if (images.length < pairCount) {
        throw new Error(`Not enough card images for theme "${theme}". Needed: ${pairCount}, available: ${images.length}`);
    }
    return images.slice(0, pairCount);
}

// build pairs of cards
function buildPairs(images: string[]): CardModel[] {
    return images.flatMap((img, pairIndex) => ([
        { id: pairIndex * 2, pairIndex, imgSrc: img },
        { id: pairIndex * 2 + 1, pairIndex, imgSrc: img }
    ]));
}

// shuffle cards
function shuffleDeck(deck: CardModel[]): CardModel[] {
    return deck.sort(() => Math.random() - 0.5);
}

// create indexed pairs of cards
function createIndexedPairs(theme: string, boardSize: number): CardModel[] {
    let pairCount = boardSize / 2;
    let images = getThemeImages(theme, pairCount, cardImages);
    return shuffleDeck(buildPairs(images));
}

// create game state based on selected board size and first player
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

// update score elements
function updateScoreElements(player: PlayerColor, score: number) {
    let colorClass = player === 'Orange' ? '--orange' : '--blue';
    let cvScore = document.querySelector(`.standings .--cv-standings.${colorClass} .--score`) as HTMLElement | null;
    let gtScore = document.querySelector(`.standings .--gt-standings.${colorClass} p`) as HTMLElement | null;
    if (cvScore) cvScore.textContent = String(score);
    if (gtScore) gtScore.textContent = String(score);
}

function renderStandings(state: GameState) {
    updateScoreElements('Blue', state.blueScore);
    updateScoreElements('Orange', state.orangeScore);
}

function addPoint(state: GameState, player: PlayerColor) {
    if (player === 'Orange') state.orangeScore += 1;
    if (player === 'Blue') state.blueScore += 1;
    renderStandings(state);
}

function resolveWinner(state: GameState): Winner {
    if (state.orangeScore > state.blueScore) return 'Orange';
    if (state.blueScore > state.orangeScore) return 'Blue';
    return 'Draw';
}

// build the game result object based on the final game state
export function buildGameResult(state: GameState): GameResult {
    return {
        winner: resolveWinner(state),
        orangeScore: state.orangeScore,
        blueScore: state.blueScore
    };
}

// create a card element 
function createCardElement(cardData: CardModel, theme: string, state: GameState): HTMLElement {
    let card = document.createElement('div');
    card.classList.add('card');
    card.dataset['pairIndex'] = String(cardData.pairIndex);
    card.dataset['cardId'] = String(cardData.id);
    card.innerHTML = cardTemplate(theme, cardData.imgSrc);
    card.addEventListener('click', () => onCardClick(card, state));
    return card;
}

// render game deck based on created pairs of cards
function renderDeck(table: HTMLElement, deck: CardModel[], theme: string, state: GameState) {
    deck.forEach(cardData => table.appendChild(createCardElement(cardData, theme, state)));
}

// create game board 
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

// check if card can be fliopped
function canFlipCard(card: HTMLElement, state: GameState): boolean {
    if (state.lockBoard) return false;
    if (card.classList.contains('card--flipped')) return false;
    if (card.classList.contains('card--matched')) return false;
    return true;
}

// handles card click events
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

// handle matched cards
function handleMatch(state: GameState, cards: [HTMLElement, HTMLElement], player: PlayerColor) {
    markCardsAsMatched(cards, player);
    addPoint(state, player);
    state.matchedPairs += 1;
    if (state.matchedPairs === state.totalPairs) {
        safeGameResult(state);
        window.setTimeout(() => {
            gameOver();
        }, 2000);
    }
    finishTurn(state, false);
}

// handle mismatched cards
function handleMismatch(state: GameState, cards: [HTMLElement, HTMLElement]) {
    window.setTimeout(() => {
        cards.forEach(card => card.classList.remove('card--flipped'));
        finishTurn(state, true);
    }, 850);
}

// handle card state - if two cards are opened and if they match or not
function resolveOpenCards(state: GameState, hooks: TurnHooks) {
    let [first, second] = state.openCards as [HTMLElement, HTMLElement];
    let samePair = first.dataset['pairIndex'] === second.dataset['pairIndex'];
    if (samePair) {
        hooks.onMatch([first, second], state.currentPlayer);
        return;
    }
    hooks.onMismatch([first, second]);
}

// mark cards as matched and add player specific class for matched
function markCardsAsMatched(cards: [HTMLElement, HTMLElement], player: PlayerColor) {
    let playerClass = player === 'Orange' ? 'card--matched-orange' : 'card--matched-blue';

    cards.forEach(card => {
        card.classList.add('card--matched');
        card.classList.add(playerClass);
    });
}

// finish turn after mismatch and switch player
function finishTurn(state: GameState, switchPlayer: boolean) {
    state.openCards = [];
    state.lockBoard = false;

    if (switchPlayer) {
        state.currentPlayer = nextPlayer(state.currentPlayer);
        renderCurrentPlayer(state.currentPlayer);
    }
}

// get specific indicator variant
function getIndicatorVariant(): string {
    let isGamesTheme = document.body.classList.contains('games-theme');
    return isGamesTheme ? 'indicator--pawn' : 'indicator--label';
}

// render the current player indicator
function renderCurrentPlayer(player: PlayerColor) {
    let indicator = document.querySelector('.current-player__indicator') as HTMLElement | null;
    if (!indicator) return;

    indicator.className = 'current-player__indicator';
    indicator.classList.add(getIndicatorVariant());
    indicator.classList.add(player === 'Orange' ? 'is-orange' : 'is-blue');
}