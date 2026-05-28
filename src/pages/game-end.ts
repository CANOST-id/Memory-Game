import { applyTheme, loadGameSettings, loadResultFromStorage, type GameResult } from '../services/game-result';

type Winner = GameResult['winner'];
const WINNER_CLASSES = ['is-orange', 'is-blue', 'is-draw'];

function getWinnerLabel(winner: Winner): string {
	if (winner === 'Orange') return 'Orange player';
	if (winner === 'Blue') return 'Blue player';
	return 'Draw';
}

function getWinnerClass(winner: Winner): string {
	if (winner === 'Orange') return 'is-orange';
	if (winner === 'Blue') return 'is-blue';
	return 'is-draw';
}

function getStatusText(isDraw: boolean): string {
	return isDraw ? 'Its a' : 'The winner is';
}

function setElementClass(element: HTMLElement, winnerClass: string) {
	element.classList.remove(...WINNER_CLASSES);
	element.classList.add(winnerClass);
}

function setTextForAll(selector: string, text: string) {
	document.querySelectorAll(selector).forEach(element => {
		(element as HTMLElement).textContent = text;
	});
}

function setClassForAll(selector: string, winnerClass: string) {
	document.querySelectorAll(selector).forEach(element => {
		setElementClass(element as HTMLElement, winnerClass);
	});
}

function setClassForOne(selector: string, winnerClass: string) {
	const element = document.querySelector(selector) as HTMLElement | null;
	if (!element) return;
	setElementClass(element, winnerClass);
}

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

function applyWinnerVisuals(winnerClass: string) {
	setClassForOne('.winner-icon--pawn', winnerClass);
	setClassForAll('.draw-image', winnerClass);
	setClassForOne('.draw-title', winnerClass);
	setClassForOne('.draw-logo', winnerClass);
}

function renderWinner(result: GameResult) {
	const isDraw = result.winner === 'Draw';
	const winnerClass = getWinnerClass(result.winner);
	setTextForAll('.status-text', getStatusText(isDraw));
	setThemeState(isDraw);
	applyWinnerText(result.winner, winnerClass);
	applyWinnerVisuals(winnerClass);
}

function goToHome() {
	window.location.href = 'index.html';
}

function bindButtons() {
	document.getElementById('back-to-start')?.addEventListener('click', goToHome);
	document.getElementById('home')?.addEventListener('click', goToHome);
}

function initGameEndPage() {
	const settings = loadGameSettings();
	if (settings?.theme) applyTheme(settings.theme);

	const result = loadResultFromStorage();
	if (result) renderWinner(result);

	bindButtons();
}

if (document.querySelector('.game-end')) {
	initGameEndPage();
}
