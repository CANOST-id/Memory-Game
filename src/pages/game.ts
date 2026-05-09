import { cardImages } from '../services/cards';
interface Settings {
    theme: string;
    player: string;
    boardSize: number | string;
}

//  check if DOM is loaded before initializing the settings page
if (document.querySelector('.game')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
}

// Initialize the game based on saved settings or defaults
function initGame() {
    const settings = loadGameSettings();

    const themeClass = applyTheme(settings.theme);
    createGameBoard(settings.boardSize, themeClass);
    initPlayer(settings.player);
}

// Load game settings from localStorage or return default settings
function loadGameSettings(): Settings {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
        return JSON.parse(savedSettings);
    }
    return { theme: '', player: '', boardSize: '' };
}

// Apply the selected theme by adding the corresponding class to the body element
function applyTheme(theme: string) {
    const themeMap: Record<string, string> = {
        'Code vibes theme': 'code-vibes',
        'Gaming theme': 'games-theme'
    };

    const themeClass = themeMap[theme];
    Object.values(themeMap).forEach(cls => document.body.classList.remove(cls));
    if (themeClass) {
        document.body.classList.add(themeClass);
    }
    return themeClass;
}

// Create the game board based on the selected board size and theme
function createGameBoard(boardSize: number | string, theme: string) {
    const table = document.querySelector('.game__table') as HTMLElement;
    const size = parseInt(boardSize as string);
    table.dataset['size'] = String(size);

    const images = cardImages[theme];
    const selected = images.slice(0, size / 2);
    const pairs = [...selected, ...selected];
    const shuffled = pairs.sort(() => Math.random() - 0.5);

    for (let i = 0; i < size; i++) {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = cardTemplate(theme, shuffled[i]);

        card.addEventListener('click', () => card.classList.toggle('card--flipped'));
        table.appendChild(card);
    }
}

// Generate the HTML template for a card based on the theme and image source
function cardTemplate(theme: string, imgSrc: string): string {
        return `
            <div class="card__inner">
                <div class="card__back">
                    <img src="/src/assets/cards/${theme}/da-logo.png" alt="card back">
                </div>
                <div class="card__front">
                    <img src="${imgSrc}" alt="card image">
                </div>
            </div>
        `;
}

function initPlayer(playerMode: string) {
    // current player 
}

// for testing purposes only, remove later
document.getElementById('start-game')?.addEventListener('click', () => {
    console.log(loadGameSettings());
})