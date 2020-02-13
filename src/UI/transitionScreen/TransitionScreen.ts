import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import Quote from "./Quote.js";
import { indentWithNBS } from "../../util/Text.js";
import WorldScreen from "../worldScreen/WorldScreen.js";
import Game from "../../Game.js";

// "loading" screen shown between turns
export default class TransitionScreen implements Page {
    readonly html: HTMLElement;
    private loadingArea: HTMLElement;
    private loadingBar: HTMLElement;
    private quote: Quote;

    constructor(
        private run: Game
    ) {
        this.html = UI.makeDiv();
        this.loadingBar = UI.makeDiv(["transition-loading-bar"]);
        this.loadingArea = UI.makeDivContaining([
            this.loadingBar
        ], ["transition-loading-area"]);
        this.quote = Quote.getRandomQuote();

        // Add in leading quote after leading whitespace
        let quotedText = indentWithNBS(this.quote.text).replace(/^(\s*)/, "$1“") + "”";
        UI.fillHTML(this.html, [
            UI.makeDivContaining([
                UI.makePara(`${quotedText}`),
                UI.makePara(`-${this.quote.attribution}`, ["transition-attribution"])
            ], ["transition-quote-panel"]),
            this.loadingArea
        ]);
    }

    refresh(): void {}

    startLoading(): void {
        setTimeout(() => this.loadingArea.classList.add("loading"));
        this.run.completeTurn();

        setTimeout(() => this.loadingArea.classList.add("loaded"));
        setTimeout(() => {
            UI.fillHTML(this.loadingArea, [
                UI.makeButton("Continue", () => { this.continueToNextTurn(); })
            ]);
        }, 750);
    }

    private continueToNextTurn(): void {
        GameWindow.show(new WorldScreen(this.run));
    }
}
