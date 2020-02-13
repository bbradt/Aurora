import Game from "../../Game.js";
import StaticScreen from "./StaticScreen.js";

// A LoseScreen is a static screen, which currently
//    just has a fixed header GAME OVER!,
//    along with a custom message.
// This class should be elaborated on to add 
//    additional functionality if desired.
export default class LoseScreen extends StaticScreen {

    constructor(run: Game, message: string, innerHtml: HTMLElement) {
        const loseHeader = "GAME OVER!";
        const loseElementName = "lose";
        super(run, loseElementName, loseHeader, message, innerHtml);
    }

}
