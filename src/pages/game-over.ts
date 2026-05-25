interface GameResult {
    winner: 'Orange' | 'Blue' | 'Draw';
    orangeScore: number;
    blueScore: number;
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
    const orangeScoreElement = document.getElementById('orange-score');
    const blueScoreElement = document.getElementById('blue-score');
    if (!orangeScoreElement || !blueScoreElement) return;

    orangeScoreElement.textContent = String(result.orangeScore);
    blueScoreElement.textContent = String(result.blueScore);
}

// check if game-over page is loaded and display the score
if (document.querySelector('.game-over')) {
    const result = loadScoreFromStorage();
    if (result) displayFinalScore(result);
}