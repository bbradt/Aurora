import Game from "../../Game.js";
import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import Conversion from "../../resources/Conversion.js";
import Inventory from "../../resources/Inventory.js";
import WorldScreen from "../worldScreen/WorldScreen.js";

import Sortable from "sortablejs";

// the production screen is where the player selects the priority order for resource conversions
export default class ProductionScreen implements Page {
    readonly html: HTMLElement;
    private run: Game;

    constructor(run: Game) {
        this.run = run;
        this.html = UI.makeDiv(["production-screen"]);
        this.refresh();
    }

    refresh(): void {
        // clone of the inventory that represents what the inventory will be after this turn's conversions are applied
        const inventoryCopy = this.run.inventory.clone();

        const { free, costly } = this.run.getResourceConversions();

        inventoryCopy.applyConversions(free);

        const freeConversionsHTML: HTMLElement[] = free.map(conversion => this.renderConversion(conversion, true));
        const freeConversionsDiv = UI.makeDivContaining(freeConversionsHTML);

        const costlyConversionsHTML: HTMLElement[] = [];
        for (const conversion of costly) {
            if (inventoryCopy.canAfford(conversion.inputs) && inventoryCopy.hasEnoughWorkers(conversion.requiredWorkers)) {
                costlyConversionsHTML.push(this.renderConversion(conversion, true));
                inventoryCopy.applyConversions([conversion]);
            } else {
                costlyConversionsHTML.push(this.renderConversion(conversion, false));
            }
        }
        const costlyConversionsDiv = UI.makeDivContaining(costlyConversionsHTML);

        Sortable.create(costlyConversionsDiv, {
            onEnd: evt => {
                const fromIndex = evt.oldDraggableIndex;
                const toIndex = evt.newDraggableIndex;
                if (fromIndex !== undefined && toIndex !== undefined) {
                    this.shiftCostlyConversion(fromIndex, toIndex);
                }
            }
        });

        UI.fillHTML(this.html, [
            UI.makePara("Resource Production Report", [`production-screen-label`]),
            UI.makePara(`Available workers at start of next production cycle: ${this.run.inventory.getAvailableWorkers()}`, [`production-screen-label`]),
            UI.makePara("Resources available at start of next production cycle:", [`production-screen-label`]),
            this.renderInventory(this.run.inventory),
            UI.makePara("Resource generation in next production cycle:", [`production-screen-label`]),
            freeConversionsDiv,
            UI.makePara("Resource conversion in next production cycle:", [`production-screen-label`]),
            costlyConversionsDiv,
            UI.makePara(`Unused workers at end of next production cycle: ${inventoryCopy.getAvailableWorkers()}`, [`production-screen-label`]),
            UI.makePara("Resources available at end of next production cycle:", [`production-screen-label`]),
            this.renderInventory(inventoryCopy),
            UI.makeButton("Back", () => {GameWindow.show(new WorldScreen(this.run));}, ["production-screen-back-button"]),
        ]);
    }

    getHTML(): HTMLElement {
        return this.html;
    }

    private renderInventory(inventory: Inventory): HTMLElement {
        const resourceDescriptions = inventory.getInventoryStrings().map(resourceString => UI.makePara(resourceString));

        if (resourceDescriptions.length == 0) {
            resourceDescriptions.push(UI.makePara("(none)"));
        }

        return UI.makeDivContaining(resourceDescriptions, ["production-screen-inventory"]);
    }

    renderConversion(conversion: Conversion, canAfford: boolean): HTMLElement {
        const div = UI.makeDiv(["flex-horizontal"]);

        let text = conversion.toString();
        let cssClass = "conversion-description-normal"; // css class that changes to show the conversion's status
        if (!conversion.enabled) {
            text = `(disabled) ${conversion.toString()}`;
            cssClass = "conversion-description-disabled";
        } else if (!canAfford) {
            text = `(cannot afford) ${conversion.toString()}`;
            cssClass = `conversion-description-cannot-afford`;
        }

        const textPara = UI.makePara(text, [cssClass, "conversion-description"]);
        const textDiv = UI.makeDivContaining([textPara], ["conversion-description-box"]);
        div.appendChild(textDiv);
        div.appendChild(UI.makeButton("Toggle", () => { this.toggle(conversion); }));

        return div;
    }

    private shiftCostlyConversion(fromIndex: number, toIndex: number): void {
        this.run.shiftCostlyConversionPriority(fromIndex, toIndex);
        this.refresh();
    }

    private toggle(conversion: Conversion): void {
        conversion.enabled = !conversion.enabled;
        this.refresh();
    }
}
