// settings.ts - handles the settings page of the memory game
export interface Settings {
    theme: string;
    player: string;
    boardSize: number | string;
}

// check if DOM is loaded before initializing the settings page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
} else {
    initSettings();
}

// init function to add event listeners to all radio buttons
function initSettings() {
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');

    allRadioButtons.forEach(radio => {
        radio.addEventListener('change', () => updatePreview(getCurrentSettings()));
    })
}

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
