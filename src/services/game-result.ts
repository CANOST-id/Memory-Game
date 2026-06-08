export interface GameResult {
    winner: 'Orange' | 'Blue' | 'Draw';
    orangeScore: number;
    blueScore: number;
}

export interface Settings {
    theme: string;
}

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

// apply the selected theme
export function applyTheme(theme: string) {
    const themeMap: Record<string, string> = {
        'Code vibes theme': 'code-vibes',
        'Gaming theme': 'games-theme'
    };

    Object.values(themeMap).forEach(cls => document.body.classList.remove(cls));
    const themeClass = themeMap[theme];
    if (themeClass) document.body.classList.add(themeClass);
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