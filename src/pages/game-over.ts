interface GameResult {
    winner: 'Orange' | 'Blue' | 'Draw';
    orangeScore: number;
    blueScore: number;
}

interface Settings {
    theme: string;
}

type PlayerColor = 'Orange' | 'Blue';

function loadGameSettings(): Settings | null {
    const rawSettings = localStorage.getItem('settings');
    if (!rawSettings) return null;

    try {
        return JSON.parse(rawSettings) as Settings;
    } catch {
        return null;
    }
}

function applyTheme(theme: string) {
    const themeMap: Record<string, string> = {
        'Code vibes theme': 'code-vibes',
        'Gaming theme': 'games-theme'
    };

    Object.values(themeMap).forEach(cls => document.body.classList.remove(cls));
    const themeClass = themeMap[theme];
    if (themeClass) document.body.classList.add(themeClass);
}

// Load the game result from localStorage
function loadScoreFromStorage(): GameResult | null {
    const rawResult = localStorage.getItem('gameResult');
    if (!rawResult) return null;

    try {
        return JSON.parse(rawResult) as GameResult;
    } catch {
        return null;
    }
}

// show the final score
function displayFinalScore(result: GameResult): void {
    updateScoreElements('Blue', result.blueScore);
    updateScoreElements('Orange', result.orangeScore);
}

function updateScoreElements(player: PlayerColor, score: number) {
    const colorClass = player === 'Orange' ? '--orange' : '--blue';
    const cvScore = document.querySelector(`.game-over__theme--code-vibes .--cv-standings.${colorClass} .--score`) as HTMLElement | null;
    const gtScore = document.querySelector(`.game-over__theme--games-theme .--gt-standings.${colorClass} p`) as HTMLElement | null;

    if (cvScore) cvScore.textContent = String(score);
    if (gtScore) gtScore.textContent = String(score);
}

// check if game-over page is loaded and display the score
if (document.querySelector('.game-over')) {
    const settings = loadGameSettings();
    if (settings?.theme) applyTheme(settings.theme);

    const result = loadScoreFromStorage();
    if (result) displayFinalScore(result);
}