import MainMenuUI from "./menu/MainMenuUI.js";
import UI from "./UI.js";
import WorldScreen from "./worldScreen/WorldScreen.js";
import Game from "../Game.js";
import { disableCheats, enableCheats } from "../util/Cheats.js";
import Resource from "../resources/Resource.js";
import TransitionScreen from "./transitionScreen/TransitionScreen.js";
import ProductionScreen from "./productionScreen/ProductionScreen.js";
import CreditsScreen from "./menu/CreditsScreen.js";
import WorldScreenHeader from "./worldScreen/WorldScreenHeader.js";
import Species from "../resources/Species.js";
import ResearchScreen from "./ResearchScreen.js";
import WinScreen from "./staticScreen/WinScreen.js";
import LoseScreen from "./staticScreen/LoseScreen.js";

export default class GameWindow {

    private static rootDiv: HTMLElement = document.getElementById('rootdiv')!; // root div for all of our HTML
    private static currentRun: Game;

    public static showMainMenu() {
        disableCheats();
        UI.fillHTML(this.rootDiv, [MainMenuUI.renderMainMenu()]);
    }

    public static showCredits() {
        disableCheats();
        UI.fillHTML(this.rootDiv, [CreditsScreen.render()]);
    }

    public static startGame() {
        this.currentRun = new Game();
        this.showWorldScreen();
    }

    public static showWorldScreen() {
        const worldScreen = new WorldScreen(this.currentRun);
        UI.fillHTML(this.rootDiv, [worldScreen.getHTML()]);

        enableCheats(this.currentRun, worldScreen); // cheats are available when on the world screen

        // Attach keyboard input listener
        document.onkeydown = (e: KeyboardEvent) => {
            worldScreen.handleKeyDown(e);
        };
    }

    public static showProductionScreen() {
        disableCheats();

        const productionScreen: ProductionScreen = new ProductionScreen(this.currentRun);
        UI.fillHTML(this.rootDiv, [productionScreen.getHTML()]);
    }

    public static showResearchScreen() {
        disableCheats();

        const researchScreen: ResearchScreen = new ResearchScreen(this.currentRun);
        UI.fillHTML(this.rootDiv, [researchScreen.getHTML()]);
    }

    // Show a lose screen
    public static showLoseScreen() {
        disableCheats();
        const loseScreen: LoseScreen = new LoseScreen(this.currentRun, "This is a lose message", UI.makeDiv());
        UI.fillHTML(this.rootDiv, [loseScreen.getHTML()]);
    }

    // Show a win screen
    public static showWinScreen() {
        disableCheats();
        const winScreen: WinScreen = new WinScreen(this.currentRun, "This is a win message", UI.makeDiv());
        UI.fillHTML(this.rootDiv, [winScreen.getHTML()]);
    }

    public static transitionToNextTurn() {
        disableCheats();
        const transitionScreen = new TransitionScreen();
        UI.fillHTML(this.rootDiv, [transitionScreen.getHTML()]);

        transitionScreen.startLoading();
        this.currentRun.completeTurn(); // update game state
        transitionScreen.revealButton();
        // check for win/lose state, and show static screen
        if (this.currentRun.getHasLost()) {
            this.showLoseScreen();
        }
        else if (this.currentRun.getHasWon()) {
            this.showWinScreen();
        }
    }
}
