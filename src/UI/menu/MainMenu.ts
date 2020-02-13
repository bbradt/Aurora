import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import CreditsScreen from "./CreditsScreen.js";
import { enableCheats } from "../../util/Cheats.js";
import WorldScreen from "../worldScreen/WorldScreen.js";
import Game from "../../Game.js";

// this may need to become a real class in the future
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class MainMenu implements Page {

    readonly html: HTMLElement;

    constructor() {
        this.html = UI.makeDiv(["main-menu"]);
        this.refresh();
    }

    refresh(): void {
        UI.fillHTML(this.html, [
            UI.makeHeader("Aurora", 1),
            UI.makeDivContaining([
                UI.makeButton("start_game", () => {
                    const newGame = new Game();
                    enableCheats(newGame);
                    GameWindow.show(new WorldScreen(newGame));
                }),
                UI.makeButton("display_credits", () => GameWindow.show(new CreditsScreen())),
            ], ["main-menu-options"]),
        ]);
    }
}
