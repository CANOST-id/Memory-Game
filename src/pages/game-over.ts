import { gameEnd } from '../services/navigation';
import { loadGameSettings, loadResultFromStorage } from '../services/local-storage';
import { PlayerColor, GameResult } from '../services/interfaces';
import { applyTheme } from '../pages/game';

/**
 * Displays the final score on the game-over page.
 * @param result - The final game result.
 */
function displayFinalScore(result: GameResult): void {
    updateScoreElements('Blue', result.blueScore);
    updateScoreElements('Orange', result.orangeScore);
}

/**
 * Updates the score element for the current player.
 * @param player - The current {@link PlayerColor} Player.
 * @param score - The current score of the player.
 */
function updateScoreElements(player: PlayerColor, score: number) {
    let colorClass = player === 'Orange' ? '--orange' : '--blue';
    let cvScore = document.querySelector(`.game-over__theme--code-vibes .--cv-standings.${colorClass} .--score`) as HTMLElement | null;
    let gtScore = document.querySelector(`.game-over__theme--games-theme .--gt-standings.${colorClass} p`) as HTMLElement | null;

    if (cvScore) cvScore.textContent = String(score);
    if (gtScore) gtScore.textContent = String(score);
}

/**
 * Checks if the current page is game-over page and displays the final score.
 */
if (document.querySelector('.game-over')) {
    let settings = loadGameSettings();
    if (settings?.theme) applyTheme(settings.theme);

    let result = loadResultFromStorage();
    if (result) displayFinalScore(result);

    window.setTimeout(() => {
        gameEnd();
    }, 3000);
}