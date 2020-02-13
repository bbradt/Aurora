import Game from "../../Game.js";
import { UI } from "../UI.js";
import { GameWindow } from "../GameWindow.js";
import MainMenu from "../menu/MainMenu.js";
import TransitionScreen from "../transitionScreen/TransitionScreen.js";
import ProductionScreen from "../productionScreen/ProductionScreen.js";
import ResearchScreen from "../researchScreen/ResearchScreen.js";
import WinScreen from "../staticScreen/WinScreen.js";
import LoseScreen from "../staticScreen/LoseScreen.js";

export default class WorldScreenHeader {
    private html: HTMLElement;
    private run: Game;
    /* This is used to determine when to apply "emphasis" css to newly-advanced quest objectives
     * It's tracked statically to persist when we leave the World Screen and then come back to a new world screen instance
     */

    constructor(run: Game) {
        this.html = UI.makeDiv(["world-screen-header"]);
        this.run = run;
        this.refresh();
    }

    refresh(): void {
        const quitButton = UI.makeButton("Quit Game", () => {
            GameWindow.show(new MainMenu());
        });
        const transitionButton = UI.makeButton("Next Turn", () => {
            const transitionScreen = new TransitionScreen(this.run);
            GameWindow.show(transitionScreen);
            transitionScreen.startLoading();
        });
        const productionScreenButton = UI.makeButton("Manage Production", () => {
            GameWindow.show(new ProductionScreen(this.run));
        });
        const researchScreenButton = UI.makeButton("Research Projects", () => {
            GameWindow.show(new ResearchScreen(this.run));
        });

        const questHint = this.run.getCurrentQuestHint();
        const questDescription = this.run.getCurrentQuestDescription();
        const questText = questHint ? `${questDescription}\n(hint: ${questHint})` : questDescription;
        let questHTML = UI.makePara(`Objective: ${questText}`, ["world-screen-quest-description"]);

        // THESE BUTTONS ARE FOR DEMONSTRATION PURPOSES ONLY, REMOVE BEFORE MERGING
        const gameOverButton = UI.makeButton("Lose the Game", () => {
            GameWindow.show(new LoseScreen(this.run, "Lose Message", UI.makeDiv()));
        });
        const winButton = UI.makeButton("Win the Game", () => {
            GameWindow.show(new WinScreen(this.run, "Win Message", UI.makeDiv()));
        });


        // show message after quest completion
        const prevQuestDescription = this.run.getPreviousQuestDescription();
        if (!this.run.questCompletionShown) {
            questHTML = UI.makePara(`Completed: ${prevQuestDescription}`, ["world-screen-quest-description", "quest-description-emphasis"]);

            // reset description after time has passed
            setTimeout(() => {
                this.refresh();
            }, 1500);
        }
        this.run.questCompletionShown = true;

        UI.fillHTML(this.html, [
            quitButton,
            productionScreenButton,
            researchScreenButton,
            transitionButton,
            questHTML,
            gameOverButton,
            winButton
        ]);
    }

    getHTML(): HTMLElement {
        return this.html;
    }
}
