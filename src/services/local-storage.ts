import { getCurrentSettings } from '../pages/settings';
import { Settings, GameResult, GameState } from './interfaces';
import { buildGameResult } from '../pages/game';

export function saveSettings() {
    const settingsValues = getCurrentSettings();
    localStorage.setItem('settings', JSON.stringify(settingsValues));
}

// load game result from local storage 
export function loadResultFromStorage(): GameResult | null {
    const rawResult = localStorage.getItem('gameResult');
    if (!rawResult) return null;

    try {
        return JSON.parse(rawResult) as GameResult;
    } catch {
        return null;
    }
}

export function loadGameSettings(): Settings {
    let savedSettings = localStorage.getItem('settings');
    if (savedSettings) return JSON.parse(savedSettings);
    return { theme: '', player: '', boardSize: '' };
}

export function safeGameResult(state: GameState) {
    let result = buildGameResult(state);
    localStorage.setItem('gameResult', JSON.stringify(result));
}