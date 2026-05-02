document.getElementById('start-settings')?.addEventListener('click', () => {
   startSettings();
});

function startSettings() {
 window.location.href = 'settings.html';
}

export function startGame() {
    window.location.href = 'game.html';
}

export function gameOver() {
    window.location.href = 'game-over.html';
}

export function gameEnd() {
    window.location.href = 'game-end.html';
}
