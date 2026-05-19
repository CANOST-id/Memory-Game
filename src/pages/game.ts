import { cardImages } from '../services/cards';

interface Settings {
    theme: string;
    player: string;
    boardSize: number | string;
}

type PlayerColor = 'Orange' | 'Blue';
type Winner = PlayerColor | 'Draw';

interface CardModel {
    id: number;
    pairIndex: number;
    imgSrc: string;
}

interface GameState {
    openCards: HTMLElement[];
    lockBoard: boolean;
    currentPlayer: PlayerColor;
    matchedPairs: number;
    totalPairs: number;
    orangeScore: number;
    blueScore: number;
}

interface GameResult {
    winner: Winner;
    orangeScore: number;
    blueScore: number;
}

interface TurnHooks {
    onMatch: (cards: [HTMLElement, HTMLElement], player: PlayerColor) => void;
    onMismatch: (cards: [HTMLElement, HTMLElement]) => void;
}

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
    const settings = loadGameSettings();
    const themeClass = applyTheme(settings.theme);
    createGameBoard(settings.boardSize, themeClass, settings.player);
}

// laod game settings from local storage
function loadGameSettings(): Settings {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) return JSON.parse(savedSettings);
    return { theme: '', player: '', boardSize: '' };
}

// apply the selected theme 
function applyTheme(theme: string) {
    const themeMap: Record<string, string> = {
        'Code vibes theme': 'code-vibes',
        'Gaming theme': 'games-theme'
    };

    const themeClass = themeMap[theme];
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
function getThemeImages(theme: string, pairCount: number): string[] {
    const images = cardImages[theme] || [];
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
    const pairCount = boardSize / 2;
    const images = getThemeImages(theme, pairCount);
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

function updateScoreElements(player: PlayerColor, score: number) {
    const colorClass = player === 'Orange' ? '--orange' : '--blue';
    const cvScore = document.querySelector(`.standings .--cv-standings.${colorClass} .--score`) as HTMLElement | null;
    const gtScore = document.querySelector(`.standings .--gt-standings.${colorClass} p`) as HTMLElement | null;
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

function buildGameResult(state: GameState): GameResult {
    return {
        winner: resolveWinner(state),
        orangeScore: state.orangeScore,
        blueScore: state.blueScore
    };
}

function persistGameResult(state: GameState) {
    const result = buildGameResult(state);
    localStorage.setItem('gameResult', JSON.stringify(result));
}

// create a card element 
function createCardElement(cardData: CardModel, theme: string, state: GameState): HTMLElement {
    const card = document.createElement('div');
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
    const table = document.querySelector('.game__table') as HTMLElement | null;
    if (!table) return;
    table.innerHTML = '';
    const size = normalizeBoardSize(boardSize);
    table.dataset['size'] = String(size);
    const state = createGameState(size, startPlayerFromSettings);
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
        persistGameResult(state);
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
    const [first, second] = state.openCards as [HTMLElement, HTMLElement];
    const samePair = first.dataset['pairIndex'] === second.dataset['pairIndex'];
    if (samePair) {
        hooks.onMatch([first, second], state.currentPlayer);
        return;
    }
    hooks.onMismatch([first, second]);
}

// mark cards as matched and add player specific class for matched
function markCardsAsMatched(cards: [HTMLElement, HTMLElement], player: PlayerColor) {
    const playerClass = player === 'Orange' ? 'card--matched-orange' : 'card--matched-blue';

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

function getIndicatorVariant(): string {
    const isGamesTheme = document.body.classList.contains('games-theme');
    return isGamesTheme ? 'indicator--pawn' : 'indicator--label';
}

// render the current player indicator
function renderCurrentPlayer(player: PlayerColor) {
    const indicator = document.querySelector('.current-player__indicator') as HTMLElement | null;
    if (!indicator) return;

    indicator.className = 'current-player__indicator';
    indicator.classList.add(getIndicatorVariant());
    indicator.classList.add(player === 'Orange' ? 'is-orange' : 'is-blue');
}

// template for cards
function cardTemplate(theme: string, imgSrc: string): string {
    return `
        <div class="card__inner">
            <div class="card__back">
                <img src="/src/assets/cards/${theme}/da-logo.png" alt="">
            </div>
            <div class="card__front">
                <img src="${imgSrc}" alt="card image">
            </div>
        </div>
    `;
}