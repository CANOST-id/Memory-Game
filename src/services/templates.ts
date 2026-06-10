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