import { startGame } from '../services/navigation';
export interface Settings {
    theme: string;
    player: string;
    boardSize: number | string;
}

let activeButton = false;

// check if page is loaded to handle start button state when user navigates back to the settings page from the game page
window.addEventListener('pageshow', updateStartButtonState);

// check if DOM is loaded before initializing the settings page
document.addEventListener('DOMContentLoaded', () => {
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');
    allRadioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            updatePreview(getCurrentSettings());
            updateStartButtonState();
        });
    });
});

// get current settings from the DOM and return them as an object
export function getCurrentSettings(): Settings {
    const themeRef = document.querySelector('input[name="theme"]:checked') as HTMLInputElement;
    const playerRef = document.querySelector('input[name="player"]:checked') as HTMLInputElement;
    const boardSizeRef = document.querySelector('input[name="board-size"]:checked') as HTMLInputElement;

    return {
        theme: themeRef?.value || 'Game theme',
        player: playerRef?.value || 'Player',
        boardSize: boardSizeRef?.value || 'Board size'
    }
}

// update the preview section in the settings page with the current settings
function updatePreview(settings: Settings) {
    const settingsValues = getCurrentSettings();

    let themePreview = document.getElementById('choosen_theme');
    let playerPreview = document.getElementById('choosen_player');
    let boardSizePreview = document.getElementById('choosen_board_size');

    if (themePreview) changeThemeImage();
    if (playerPreview) playerPreview.textContent = `${settingsValues.player}`;
    if (boardSizePreview) boardSizePreview.textContent = `${settingsValues.boardSize}`;
}

// change the preview image in the settings page based on the selected theme
function changeThemeImage() {
    switchPreviewImage();
    const settingsValues = getCurrentSettings();
    let themePreview = document.getElementById('choosen_theme');

    if (themePreview) themePreview.textContent = `${settingsValues.theme}`;
}

// switch the preview image
function switchPreviewImage() {
    let themeRef = document.querySelector('input[name="theme"]:checked') as HTMLInputElement;
    const themeImage = document.getElementById('theme_image') as HTMLImageElement;
    if (themeRef.value === 'Code vibes theme') {
        themeImage.src = './src/assets/images/code-vibes-img.png';
        themeImage.alt = 'code vibes theme preview';
    }
    if (themeRef.value === 'Gaming theme') {
        themeImage.src = './src/assets/images/gaming-theme-img.png';
        themeImage.alt = 'gaming theme preview';
    }
}

// update the state of start button - required function
function updateStartButtonState() {
    const startButton = document.getElementById('start-game') as HTMLButtonElement;
    const themeSelected = document.querySelector('input[name="theme"]:checked') as HTMLInputElement;
    const playerSelected = document.querySelector('input[name="player"]:checked') as HTMLInputElement;
    const boardSizeSelected = document.querySelector('input[name="board-size"]:checked') as HTMLInputElement;
    const allSelected = themeSelected && playerSelected && boardSizeSelected;
    if (startButton) {
        startButton.disabled = !allSelected;
    } if (allSelected) {
        startButton.classList.add('enabled');
        activeButton = true;
    } else {
        activeButton = false;
    }
}

// save the current settings to localStorage for later use in the game page
function saveSettings() {
    const settingsValues = getCurrentSettings();
    localStorage.setItem('settings', JSON.stringify(settingsValues));
}

// event listiner for the start game button
document.getElementById('start-game')?.addEventListener('click', (event) => {
    if (activeButton === true) {
        saveSettings();
        startGame();
    }
    else {
        event.preventDefault();
        return false;
    }
})