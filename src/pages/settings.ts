import { startGame } from '../services/navigation';
import { Settings } from '../services/interfaces';
import { saveSettings } from '../services/local-storage';

let activeButton = false;

/** Check if page is loaded to handle start button state - if user navigates back to the settings page from the game page */
window.addEventListener('pageshow', updateStartButtonState);

/** Check if DOM is loaded to add event listeners to all radio buttons on the settings page
 */
document.addEventListener('DOMContentLoaded', () => {
    let allRadioButtons = document.querySelectorAll('input[type="radio"]');
    allRadioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            updatePreview(getCurrentSettings());
            updateStartButtonState();
        });
    });
});

/**
 * Reads the currently selected settings from the radio buttons.
 * @returns The current {@link Settings} based on the selected radio buttons.
 */
export function getCurrentSettings(): Settings {
    let themeRef = document.querySelector('input[name="theme"]:checked') as HTMLInputElement;
    let playerRef = document.querySelector('input[name="player"]:checked') as HTMLInputElement;
    let boardSizeRef = document.querySelector('input[name="board-size"]:checked') as HTMLInputElement;

    return {
        theme: themeRef?.value || 'Game theme',
        player: playerRef?.value || 'Player',
        boardSize: boardSizeRef?.value || 'Board size'
    }
}

/**
 * Updates preview settings based on current selection.
 * @param settings   {@link Settings} to display.
 */
function updatePreview(settings: Settings) {
    let settingsValues = getCurrentSettings();

    let themePreview = document.getElementById('choosen_theme');
    let playerPreview = document.getElementById('choosen_player');
    let boardSizePreview = document.getElementById('choosen_board_size');

    if (themePreview) changeThemeImage();
    if (playerPreview) playerPreview.textContent = `${settingsValues.player}`;
    if (boardSizePreview) boardSizePreview.textContent = `${settingsValues.boardSize}`;
}

/**
 * Updates the theme preview image and text based on selected theme.
 */
function changeThemeImage() {
    switchPreviewImage();
    let settingsValues = getCurrentSettings();
    let themePreview = document.getElementById('choosen_theme');

    if (themePreview) themePreview.textContent = `${settingsValues.theme}`;
}

/**
 * Set the `src` and `alt` attributes of the preview image based on the currently selected theme.
 */
function switchPreviewImage() {
    let themeRef = document.querySelector('input[name="theme"]:checked') as HTMLInputElement;
    let themeImage = document.getElementById('theme_image') as HTMLImageElement;
    if (themeRef.value === 'Code vibes theme') {
        themeImage.src = 'assets/images/code-vibes-img.png';
        themeImage.alt = 'code vibes theme preview';
    }
    if (themeRef.value === 'Gaming theme') {
        themeImage.src = 'assets/images/gaming-theme-img.png';
        themeImage.alt = 'gaming theme preview';
    }
}

/**
 * Enable or disalbe the start button - if all settings options are selected.
 * Options - Theme, Player and Board Size
 */
function updateStartButtonState() {
    let startButton = document.getElementById('start-game') as HTMLButtonElement;
    let themeSelected = document.querySelector('input[name="theme"]:checked') as HTMLInputElement;
    let playerSelected = document.querySelector('input[name="player"]:checked') as HTMLInputElement;
    let boardSizeSelected = document.querySelector('input[name="board-size"]:checked') as HTMLInputElement;
    let allSelected = themeSelected && playerSelected && boardSizeSelected;
    if (startButton) {
        startButton.disabled = !allSelected;
    } if (allSelected) {
        startButton.classList.add('enabled');
        activeButton = true;
    } else {
        activeButton = false;
    }
}

/** Starts game, if all settings are selected - otherwise prevents navigation. */
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