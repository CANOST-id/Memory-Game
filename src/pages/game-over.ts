import { gameEnd } from '../services/navigation';
import { loadGameSettings, loadResultFromStorage } from '../services/local-storage';
import { PlayerColor, GameResult } from '../services/interfaces';
import { applyTheme } from '../pages/game';

// show the final score
function displayFinalScore(result: GameResult): void {
    updateScoreElements('Blue', result.blueScore);
    updateScoreElements('Orange', result.orangeScore);
}

// update score elements
function updateScoreElements(player: PlayerColor, score: number) {
    let colorClass = player === 'Orange' ? '--orange' : '--blue';
    let cvScore = document.querySelector(`.game-over__theme--code-vibes .--cv-standings.${colorClass} .--score`) as HTMLElement | null;
    let gtScore = document.querySelector(`.game-over__theme--games-theme .--gt-standings.${colorClass} p`) as HTMLElement | null;

    if (cvScore) cvScore.textContent = String(score);
    if (gtScore) gtScore.textContent = String(score);
}

// check if game-over page is loaded and display the score
if (document.querySelector('.game-over')) {
    let settings = loadGameSettings();
    if (settings?.theme) applyTheme(settings.theme);

    let result = loadResultFromStorage();
    if (result) displayFinalScore(result);

    window.setTimeout(() => {
        gameEnd();
    }, 3000);
}