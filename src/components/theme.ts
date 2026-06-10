export function isCodeVibesTheme(): boolean {
	return document.body.classList.contains('code-vibes');
}

export function isGamesTheme(): boolean {
	return document.body.classList.contains('games-theme');
}

export function applyTheme(theme: string) {
    const themeMap: Record<string, string> = {
        'Code vibes theme': 'code-vibes',
        'Gaming theme': 'games-theme'
    };

    Object.values(themeMap).forEach(cls => document.body.classList.remove(cls));
    const themeClass = themeMap[theme];
    if (themeClass) document.body.classList.add(themeClass);
}