import { quitGame } from '../services/navigation';

let dialog = document.querySelector('dialog') as HTMLElement | null;
let dialogInner = document.getElementById('dialog_inner') as HTMLElement | null;
let openButton = document.getElementById('exit-game');
let backToGameButton = document.getElementById('back-to-game');
let exitGameDialogButton = document.getElementById('exit-game-dialog');
let ANIMATION_DURATION_MS = 320;

/**
 * Opens the dialog by removing any closing animation classes and adding the show class.
 * @param dialogElement - The dialog element to open.
 */
function openDialog(dialogElement: HTMLElement): void {
    dialogElement.classList.remove('is-closing-up', 'is-closing-down', 'is-closing-fade');
    dialogElement.classList.add('show-dialog');
}

/**
 * Removes the show class.
 * @param dialogElement - The dialog element to finish closing.
 */
function finishClose(dialogElement: HTMLElement): void {
    dialogElement.classList.remove('show-dialog', 'is-closing-up', 'is-closing-down', 'is-closing-fade');
}

/**
 * Closes the dialog by adding current theme closing animation class and removing the show class after the animation duration.
 * @param dialogElement - The dialog element.
 * @param mode - The current theme animation mode.
 * @returns void - The function does not return a value.
 */
function closeDialog(dialogElement: HTMLElement, mode: 'up' | 'down' | 'fade'): void {
    if (!dialogElement.classList.contains('show-dialog')) return;
    if (dialogElement.classList.contains('is-closing-up') || dialogElement.classList.contains('is-closing-down') || dialogElement.classList.contains('is-closing-fade')) return;

    if (mode === 'up') dialogElement.classList.add('is-closing-up');
    if (mode === 'down') dialogElement.classList.add('is-closing-down');
    if (mode === 'fade') dialogElement.classList.add('is-closing-fade');

    window.setTimeout(() => finishClose(dialogElement), ANIMATION_DURATION_MS);
}

/**
 *  The closing animation class based on the current theme.
 * @returns 'up' or 'down' - The closing animation mode.
 */
function getBackdropCloseMode(): 'up' | 'down' {
    if (document.body.classList.contains('code-vibes'))
        return 'up';
    if (document.body.classList.contains('games-theme'))
        return 'down';
    return 'up';
}

/**
 * Eventlistiners for open and close dialog
 * - Open dialog when open button is clicked.
 * - Close dialog with animation when back to game button is clicked.
 * - Close dialog with animation when clicking outside the dialog inner content.
 * - Stop propagation of click events on the dialog inner content to prevent closing the dialog when clicking inside it.
 * - Quit game and navigate to settings page when exit game button in dialog is clicked.
 */
if (dialog && dialogInner && openButton && backToGameButton && exitGameDialogButton) {
    openButton.addEventListener('click', () => {
        openDialog(dialog);
    });

    backToGameButton.addEventListener('click', () => {
        closeDialog(dialog, 'fade');
    });

    dialogInner.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    dialog.addEventListener('click', () => {
        closeDialog(dialog, getBackdropCloseMode());
    });

    exitGameDialogButton.addEventListener('click', () => {
        quitGame();
    });
}