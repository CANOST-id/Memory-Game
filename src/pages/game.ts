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
function initGame() {
    const settings = loadGameSettings();

    applyTheme(settings.theme);
    createGameBoard(settings.boardSize);
    initPlayer(settings.player);
}

function loadGameSettings(): Settings {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
        return JSON.parse(savedSettings);
    }
    return { theme: '', player: '', boardSize: '' };
}

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
}

function createGameBoard(boardSize: number | string) {
    const table = document.querySelector('.game__table') as HTMLElement;
    const size = parseInt(boardSize as string);
    table.dataset['size'] = String(size);

    for (let i = 0; i < size; i++) {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <div class="card__inner">
                <div class="card__back">
                    <img src="/src/assets/cards/code-vibes/da-logo.png" alt="DA Logo">
                </div>
                <div class="card__front"></div>
            </div>
        `;

        card.addEventListener('click', () => card.classList.toggle('card--flipped'));
        table.appendChild(card);
    }
}

function initPlayer(playerMode: string) {
    // current player 
}


document.getElementById('start-game')?.addEventListener('click', () => {
    console.log(loadGameSettings());
})