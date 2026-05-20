import { isCodeVibesTheme } from '../components/code-vibes';
import { isGamesTheme } from '../components/games-theme';
import { quitGame } from '../services/navigation';

const dialog = document.querySelector('dialog') as HTMLElement | null;
const dialogInner = document.getElementById('dialog_inner') as HTMLElement | null;
const openButton = document.getElementById('exit-game');
const backToGameButton = document.getElementById('back-to-game');
const exitGameDialogButton = document.getElementById('exit-game-dialog');
const ANIMATION_DURATION_MS = 320;

function openDialog(dialogElement: HTMLElement): void {
    dialogElement.classList.remove('is-closing-up', 'is-closing-down', 'is-closing-fade');
    dialogElement.classList.add('show-dialog');
}

function finishClose(dialogElement: HTMLElement): void {
    dialogElement.classList.remove('show-dialog', 'is-closing-up', 'is-closing-down', 'is-closing-fade');
}

function closeDialog(dialogElement: HTMLElement, mode: 'up' | 'down' | 'fade'): void {
    if (!dialogElement.classList.contains('show-dialog')) return;
    if (dialogElement.classList.contains('is-closing-up') || dialogElement.classList.contains('is-closing-down') || dialogElement.classList.contains('is-closing-fade')) return;

    if (mode === 'up') dialogElement.classList.add('is-closing-up');
    if (mode === 'down') dialogElement.classList.add('is-closing-down');
    if (mode === 'fade') dialogElement.classList.add('is-closing-fade');

    window.setTimeout(() => finishClose(dialogElement), ANIMATION_DURATION_MS);
}

function getBackdropCloseMode(): 'up' | 'down' {
    if (isGamesTheme()) return 'down';
    if (isCodeVibesTheme()) return 'up';
    return 'up';
}

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