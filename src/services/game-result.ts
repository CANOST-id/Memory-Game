import { Settings, GameResult } from './interfaces';

// load game settings from local storage
export function loadGameSettings(): Settings | null {
    const rawSettings = localStorage.getItem('settings');
    if (!rawSettings) return null;

    try {
        return JSON.parse(rawSettings) as Settings;
    } catch {
        return null;
    }
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