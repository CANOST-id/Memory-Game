import { quitGame } from '../services/navigation';

let dialog = document.querySelector('dialog') as HTMLElement | null;
let dialogInner = document.getElementById('dialog_inner') as HTMLElement | null;
let openButton = document.getElementById('exit-game');
let backToGameButton = document.getElementById('back-to-game');
let exitGameDialogButton = document.getElementById('exit-game-dialog');
let ANIMATION_DURATION_MS = 320;

// dialog open/close functions with animation handling
function openDialog(dialogElement: HTMLElement): void {
    dialogElement.classList.remove('is-closing-up', 'is-closing-down', 'is-closing-fade');
    dialogElement.classList.add('show-dialog');
}

// remove all closing classes and hide dialog after animation
function finishClose(dialogElement: HTMLElement): void {
    dialogElement.classList.remove('show-dialog', 'is-closing-up', 'is-closing-down', 'is-closing-fade');
}

// close dialog with specific animation based on mode
function closeDialog(dialogElement: HTMLElement, mode: 'up' | 'down' | 'fade'): void {
    if (!dialogElement.classList.contains('show-dialog')) return;
    if (dialogElement.classList.contains('is-closing-up') || dialogElement.classList.contains('is-closing-down') || dialogElement.classList.contains('is-closing-fade')) return;

    if (mode === 'up') dialogElement.classList.add('is-closing-up');
    if (mode === 'down') dialogElement.classList.add('is-closing-down');
    if (mode === 'fade') dialogElement.classList.add('is-closing-fade');

    window.setTimeout(() => finishClose(dialogElement), ANIMATION_DURATION_MS);
}

// check current theme to handle close animation direction
function getBackdropCloseMode(): 'up' | 'down' {
    if (document.body.classList.contains('code-vibes'))
        return 'up';
    if (document.body.classList.contains('games-theme'))
        return 'down';
    return 'up';
}

// initialize dialog event listeners if all elements are present
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