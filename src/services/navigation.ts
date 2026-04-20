document.getElementById('start-settings')?.addEventListener('click', () => {
   startSettings();
});

function startSettings() {
 window.location.href = 'settings.html';
}

function startGame() {
    window.location.href = 'game.html';
}

function gameOver() {
    window.location.href = 'game-over.html';
}

function gameEnd() {
    window.location.href = 'game-end.html';
}
