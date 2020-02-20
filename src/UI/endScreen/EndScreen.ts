import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import Ending from "../../quests/Ending.js";
import MainMenu from "../menu/MainMenu.js";

export default class EndScreen implements Page {

    private ending: Ending;
    readonly html: HTMLElement;

    constructor(ending: Ending) {
        this.ending = ending;
        this.html = UI.makeDiv();
        this.refresh();
    }

    refresh(): void {
        const endingHeader = UI.makeHeader(this.ending.title);
        const endingDescription = UI.makePara(this.ending.description);
        const quitButton = UI.makeButton("Quit Game", () => {
            GameWindow.show(new MainMenu());
        });
        UI.fillHTML(this.html, [
            endingHeader,
            endingDescription,
            quitButton,
        ]);
    }

}
