import { loadGameSettings, loadResultFromStorage } from '../services/local-storage';
import { GameResult, Winner } from '../services/interfaces';
import { applyTheme } from '../pages/game';
import { goToHome } from '../services/navigation';

/**
 * Gets the label for the winner.
 * @param winner - The {@link Winner} of the game.
 * @returns The label of the winner or "Draw" if it's a draw.
 */
function getWinnerLabel(winner: Winner): string {
	if (winner === 'Orange') return 'Orange player';
	if (winner === 'Blue') return 'Blue player';
	return 'Draw';
}

/**
 * Gets the CSS class for the winner or draw state.
 * @param winner the {@link Winner} of the game.
 * @returns The CSS class to the winner or draw state.
 */
function getWinnerClass(winner: Winner): string {
	if (winner === 'Orange') return 'is-orange';
	if (winner === 'Blue') return 'is-blue';
	return 'is-draw';
}

/**
 * Gets the status text based on whether it's a draw or not.
 * @param isDraw 
 * @returns 
 */
function getStatusText(isDraw: boolean): string {
	return isDraw ? 'Its a' : 'The winner is';
}

/**
 * Sets the CSS class for an element based on the winner or draw state.
 * @param element - The HTML element to update.
 * @param winnerClass - The CSS class of the winner or draw state to apply.
 */
function setElementClass(element: HTMLElement, winnerClass: string) {
	element.classList.remove('is-orange', 'is-blue', 'is-draw');
	element.classList.add(winnerClass);
}

/**
 * Sets the text content for all elements matching the selector
 * @param selector - The CSS selector to identify the elements to update.
 * @param text - The text content to set for the matched elements.
 */
function setTextForAll(selector: string, text: string) {
	document.querySelectorAll(selector).forEach(element => {
		(element as HTMLElement).textContent = text;
	});
}

/**
 * Sets CSS classses for all matched elements based on state of the game end.
 * @param selector - The CSS selector to identify the elements to update.
 * @param winnerClass - The CSS class of the winner or draw state to apply.
 */
function setClassForAll(selector: string, winnerClass: string) {
	document.querySelectorAll(selector).forEach(element => {
		setElementClass(element as HTMLElement, winnerClass);
	});
}

/**
 * Sets the CSS class for a element based the state of the game end.
 * @param selector - The CSS selector to identify the element to update.
 * @param winnerClass - The CSS class of the winner or draw state to apply.
 * @returns - The HTML element that was updated or undefined if no element was found.
 */
function setClassForOne(selector: string, winnerClass: string) {
	let element = document.querySelector(selector) as HTMLElement | null;
	if (!element) return;
	setElementClass(element, winnerClass);
}

/**
 * Sets the theme state for all theme elements.
 * @param isDraw - A comparison if the game ended in a draw or with a winner.
 */
function setThemeState(isDraw: boolean) {
	document.querySelectorAll('.game-end__theme').forEach(element => {
		let themeRef = element as HTMLElement;
		themeRef.classList.remove('state--draw', 'state--winner');
		themeRef.classList.add(isDraw ? 'state--draw' : 'state--winner');
	});
}

/**
 * Applies the text and CSS class for the winner.
 * @param winner The {@link Winner} of the game.
 * @param winnerClass The CSS class of the winner.
 */
function applyWinnerText(winner: Winner, winnerClass: string) {
	setTextForAll('.winner', getWinnerLabel(winner));
	setClassForAll('.winner', winnerClass);
}

/**
 * Applies the visuals for the winner or draw state by updating CSS classes.
 * @param winnerClass The CSS class of the winner or draw state to apply.
 */
function applyWinnerVisuals(winnerClass: string) {
	setClassForOne('.winner-icon--pawn', winnerClass);
	setClassForAll('.draw-image', winnerClass);
	setClassForOne('.draw-title', winnerClass);
	setClassForOne('.draw-logo', winnerClass);
}

/**
 * Displays the winner.
 * @param result The final {@link GameResult} of the game, containing the winner and scores.
 */ 
function renderWinner(result: GameResult) {
	let isDraw = result.winner === 'Draw';
	let winnerClass = getWinnerClass(result.winner);
	setTextForAll('.status-text', getStatusText(isDraw));
	setThemeState(isDraw);
	applyWinnerText(result.winner, winnerClass);
	applyWinnerVisuals(winnerClass);
}

/**
 * Binds the click event listiners for the buttons on the game end page.
 */
function bindButtons() {
	document.getElementById('back-to-start')?.addEventListener('click', goToHome);
	document.getElementById('home')?.addEventListener('click', goToHome);
}

/**
 * Sets up the game and renders the winner based on the saved game result.
 * Binds the buttons on the page.
 */
function initGameEndPage() {
	let settings = loadGameSettings();
	if (settings?.theme) applyTheme(settings.theme);

	let result = loadResultFromStorage();
	if (result) renderWinner(result);

	bindButtons();
}

/**
 * Checks if the current page is game-end page and initializes the page.
 */
if (document.querySelector('.game-end')) {
	initGameEndPage();
}