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

    if (themeClass) {
        document.body.classList.add(themeClass);
    }
}

function createGameBoard(boardSize: number | string) {
    // logic to create the game board based on the selected board size
}

function initPlayer(playerMode: string) {
    // current player 
}


document.getElementById('start-game')?.addEventListener('click', () => {
    console.log(loadGameSettings());
})