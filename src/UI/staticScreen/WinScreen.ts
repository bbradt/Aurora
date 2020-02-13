import Game from "../../Game.js";
import StaticScreen from "./StaticScreen.js";

// A WinScreen is a static screen, which currently
//    just has a fixed header YOU WIN,
//    along with a custom message.
// This class should be elaborated on to add 
//    additional functionality if desired.
export default class WinScreen extends StaticScreen {

    constructor(run: Game, message: string, innerHtml: HTMLElement) {
        const winHeader = "YOU WIN!";
        const winElementName = "win";
        super(run, winElementName, winHeader, message, innerHtml);
    }

}
