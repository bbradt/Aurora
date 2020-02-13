import Game from "../../Game.js";
import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import MainMenu from "../menu/MainMenu.js";

// A StaticScreen is a generic class for rendering a screen that corresponds with a particular game state
//     and which has limited interactable functionality.
//     But which displays a header, a message, inner HTML, and then a quit button
//
//     Standard examples of a StaticScreen are a WinScreen or a LoseScreen,
//     but the generic functionality could be extended to other screens
//     such as alert screens, or maybe some of the already implemented screens
//     which work with limited interaction
// NOTE: Some of the intention behind this class has been duplicated with the Page interface
//     we may consider merging functionality to avoid duplication in the future.
export default class StaticScreen implements Page {
    readonly html: HTMLElement;      // the HTML for rendering
    private run: Game;              // the game element, currenlty unused
    public name: string;            // name of the script, for element naming
    private header: string;         // a header always displayed at the top of the screen
    private message: string;        // a message displayed below the header
    private innerHtml: HTMLElement; // container for additional HTML

    constructor(run: Game, name: string, header: string, message: string, innerHtml: HTMLElement) {
        this.run = run;
        this.name = name + '-screen';
        this.html = UI.makeDiv([this.name]);
        this.header = header;
        this.message = message;
        this.innerHtml = innerHtml;
        this.refresh();
    }

    refresh() {
        UI.fillHTML(this.html, [
            UI.makeHeader(this.header),
            UI.makePara(this.message, [this.getElementName("-message")]),
            UI.makeButton("Quit", () => {
                GameWindow.show(new MainMenu());
            }, [this.getElementName('-exit-button')]),
            this.innerHtml
        ]);
    }

    getHTML() {
        return this.html;
    }

    // append element suffix to element name 
    private getElementName(elementSuffix: string): string {
        return this.name + elementSuffix;
    }

}
