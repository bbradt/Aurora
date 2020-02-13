import Game from "../../Game.js";
import { UI } from "../UI.js";
import Technology from "../../techtree/Technology.js";
import { GameWindow, Page } from "../GameWindow.js";
import WorldScreen from "../worldScreen/WorldScreen.js";

export default class ResearchScreen implements Page {

    private run: Game;
    readonly html: HTMLElement;

    constructor(run: Game) {
        this.run = run;
        this.html = UI.makeDiv();
        this.refresh();
    }

    getHTML(): HTMLElement {
        return this.html;
    }

    refresh(): void {
        let researchHeader = UI.makeHeader("Available Research Projects");


        const possibleTechs: Technology[] = this.run.getResearchOptions();
        const researchOptionsHTML = UI.makeDivContaining(possibleTechs.map(tech => this.renderTechOption(tech)));

        if (possibleTechs.length == 0) {
            researchHeader = UI.makeDiv();
        }

        let historyHeader = UI.makeHeader("Previous Research Projects");
        const techHistory = this.run.getUnlockedTechnologies().filter(tech => tech.visible).map(tech => UI.makePara(tech.name));

        if (techHistory.length == 0) {
            historyHeader = UI.makeDiv();
        }

        const backButton = UI.makeButton("Back", () => {
            GameWindow.show(new WorldScreen(this.run));
        }, []);

        UI.fillHTML(this.html, [
            researchHeader,
            researchOptionsHTML,
            historyHeader,
            ...techHistory,
            backButton,
        ]);
    }

    private renderTechOption(tech: Technology): HTMLElement {
        const div = UI.makeDivContaining([
            UI.makePara(tech.name),
            UI.makePara(tech.description),
            UI.makePara(`Development cost: ${tech.researchCost}`),
        ]);
        let unmetPrereqs: number = 0;
        for (const prereq of tech.requiredTechs) {
            if (!this.run.hasUnlockedTechnology(prereq)) {
                unmetPrereqs++;
                div.appendChild(UI.makePara(`Requires ${prereq.name} research`));
            }
        }
        const canUnlock = (unmetPrereqs == 0) && this.run.inventory.canAfford([tech.researchCost]);
        const unlockCallback: () => void = () => {
            this.run.unlockTechnology(tech);
            this.refresh();
        };
        div.appendChild(UI.makeButton("Conduct Research", unlockCallback, [], canUnlock ? "enabled" : "disabled"));

        return div;
    }
}
