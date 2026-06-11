import { getCurrentSettings } from '../pages/settings';
import { Settings, GameResult, GameState } from './interfaces';
import { buildGameResult } from '../pages/game';

/**
 * Read game settings and save them to localStorage
 */
export function saveSettings() {
    let settingsValues = getCurrentSettings();
    localStorage.setItem('settings', JSON.stringify(settingsValues));
}

/**
 * Load game result from local storage
 * @returns The saved {@link GameResult} or "null" if no entry is found.
 */
export function loadResultFromStorage(): GameResult | null {
    let rawResult = localStorage.getItem('gameResult');
    if (!rawResult) return null;

    try {
        return JSON.parse(rawResult) as GameResult;
    } catch {
        return null;
    }
}

/**
 * Load game settings from local storage
 * @returns The saved {@link Settings} or default values if no entry is found.
 */
export function loadGameSettings(): Settings {
    let savedSettings = localStorage.getItem('settings');
    if (savedSettings) return JSON.parse(savedSettings);
    return { theme: '', player: '', boardSize: '' };
}

/**
 * Creates a {@link GameResult} from the current game state and saves it to localStorage.
 * @param state - The current {@link GameState} from which the result is calculated.
 */
export function saveGameResult(state: GameState) {
    let result = buildGameResult(state);
    localStorage.setItem('gameResult', JSON.stringify(result));
}