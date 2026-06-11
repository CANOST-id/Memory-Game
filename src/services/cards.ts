export const cardImages = {
    'code-vibes': [
        'assets/cards/code-vibes/angular.png',
        'assets/cards/code-vibes/bootstrap.png',
        'assets/cards/code-vibes/css.png',
        'assets/cards/code-vibes/django.png',
        'assets/cards/code-vibes/firebase.png',
        'assets/cards/code-vibes/git.png',
        'assets/cards/code-vibes/github.png',
        'assets/cards/code-vibes/html.png',
        'assets/cards/code-vibes/js.png',
        'assets/cards/code-vibes/node.png',
        'assets/cards/code-vibes/python.png',
        'assets/cards/code-vibes/react.png',
        'assets/cards/code-vibes/sass.png',
        'assets/cards/code-vibes/sql.png',
        'assets/cards/code-vibes/terminal.png',
        'assets/cards/code-vibes/ts.png',
        'assets/cards/code-vibes/vscode.png',
        'assets/cards/code-vibes/vue.png'
    ],
    'games-theme': [
        'assets/cards/games-theme/banana.png',
        'assets/cards/games-theme/card.png',
        'assets/cards/games-theme/circle.png',
        'assets/cards/games-theme/coin.png',
        'assets/cards/games-theme/controller.png',
        'assets/cards/games-theme/dice.png',
        'assets/cards/games-theme/labyrinth.png',
        'assets/cards/games-theme/level-up.png',
        'assets/cards/games-theme/minecraft.png',
        'assets/cards/games-theme/pacman-ghost.png',
        'assets/cards/games-theme/pacman.png',
        'assets/cards/games-theme/play.png',
        'assets/cards/games-theme/puzzle.png',
        'assets/cards/games-theme/snake.png',
        'assets/cards/games-theme/square.png',
        'assets/cards/games-theme/toad.png',
        'assets/cards/games-theme/triangle.png',
        'assets/cards/games-theme/joystick.png'
    ]
};

/**
 * Card template with the specified theme and image source.
 * @param theme - The current theme of the card.
 * @param imgSrc - The source URL of the image displayed on the card.
 * @returns An HTML string representing the card.
 */
export function cardTemplate(theme: string, imgSrc: string): string {
    return `
        <div class="card__inner">
            <div class="card__back">
                <img src="assets/cards/${theme}/da-logo.png" alt="">
            </div>
            <div class="card__front">
                <img src="${imgSrc}" alt="card image">
            </div>
        </div>
    `;
}