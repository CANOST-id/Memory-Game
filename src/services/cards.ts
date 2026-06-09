const assetPath = (path: string): string =>
    import.meta.env.BASE_URL + path.replace(/^\/+/, '');

const rawCardImages: Record<string, string[]> = {
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

export const cardImages: Record<string, string[]> = Object.fromEntries(
    Object.entries(rawCardImages).map(([theme, images]) => [
        theme,
        images.map(assetPath)
    ])
) as Record<string, string[]>;