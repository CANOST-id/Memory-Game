import { gameEnd } from '../services/navigation';
import { applyTheme, loadGameSettings, loadResultFromStorage, type GameResult } from '../services/game-result';

type PlayerColor = 'Orange' | 'Blue';

// show the final score
function displayFinalScore(result: GameResult): void {
    updateScoreElements('Blue', result.blueScore);
    updateScoreElements('Orange', result.orangeScore);
}

// update score elements
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

    const result = loadResultFromStorage();
    if (result) displayFinalScore(result);

    window.setTimeout(() => {
        gameEnd();
    }, 3000);
}