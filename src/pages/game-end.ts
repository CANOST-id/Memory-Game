import { loadGameSettings, loadResultFromStorage } from '../services/game-result';
import { GameResult, Winner } from '../services/interfaces';
import { applyTheme } from '../components/theme';

//  get the label for the winner
function getWinnerLabel(winner: Winner): string {
	if (winner === 'Orange') return 'Orange player';
	if (winner === 'Blue') return 'Blue player';
	return 'Draw';
}

// get the color/class for the winner
function getWinnerClass(winner: Winner): string {
	if (winner === 'Orange') return 'is-orange';
	if (winner === 'Blue') return 'is-blue';
	return 'is-draw';
}

// get status text based on winner or draw
function getStatusText(isDraw: boolean): string {
	return isDraw ? 'Its a' : 'The winner is';
}

// add or remove classes for winner and draw states
function setElementClass(element: HTMLElement, winnerClass: string) {
	element.classList.remove('is-orange', 'is-blue', 'is-draw');
	element.classList.add(winnerClass);
}

// set text content for all elements matching the selector
function setTextForAll(selector: string, text: string) {
	document.querySelectorAll(selector).forEach(element => {
		(element as HTMLElement).textContent = text;
	});
}

// set classes for all elements matching the selector
function setClassForAll(selector: string, winnerClass: string) {
	document.querySelectorAll(selector).forEach(element => {
		setElementClass(element as HTMLElement, winnerClass);
	});
}

// set class for a single element matching the selector
function setClassForOne(selector: string, winnerClass: string) {
	const element = document.querySelector(selector) as HTMLElement | null;
	if (!element) return;
	setElementClass(element, winnerClass);
}

// set game theme design 
function setThemeState(isDraw: boolean) {
	document.querySelectorAll('.game-end__theme').forEach(element => {
		const themeRef = element as HTMLElement;
		themeRef.classList.remove('state--draw', 'state--winner');
		themeRef.classList.add(isDraw ? 'state--draw' : 'state--winner');
	});
}

function applyWinnerText(winner: Winner, winnerClass: string) {
	setTextForAll('.winner', getWinnerLabel(winner));
	setClassForAll('.winner', winnerClass);
}

// apply visuals based on winner or draw state and theme
function applyWinnerVisuals(winnerClass: string) {
	setClassForOne('.winner-icon--pawn', winnerClass);
	setClassForAll('.draw-image', winnerClass);
	setClassForOne('.draw-title', winnerClass);
	setClassForOne('.draw-logo', winnerClass);
}

// render current winner 
function renderWinner(result: GameResult) {
	const isDraw = result.winner === 'Draw';
	const winnerClass = getWinnerClass(result.winner);
	setTextForAll('.status-text', getStatusText(isDraw));
	setThemeState(isDraw);
	applyWinnerText(result.winner, winnerClass);
	applyWinnerVisuals(winnerClass);
}

// back to home page
function goToHome() {
	window.location.href = 'index.html';
}

// bind click events for buttons
function bindButtons() {
	document.getElementById('back-to-start')?.addEventListener('click', goToHome);
	document.getElementById('home')?.addEventListener('click', goToHome);
}

// initialize the game end page by loading settings, rendering winner, and binding buttons
function initGameEndPage() {
	const settings = loadGameSettings();
	if (settings?.theme) applyTheme(settings.theme);

	const result = loadResultFromStorage();
	if (result) renderWinner(result);

	bindButtons();
}

// check if game-end page is loaded and initialize it
if (document.querySelector('.game-end')) {
	initGameEndPage();
}