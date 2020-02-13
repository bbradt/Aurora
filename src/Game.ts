import World from "./world/World.js";
import Inventory from "./resources/Inventory.js";
import Tile from "./world/Tile.js";
import { Arrays } from "./util/Arrays.js";
import Conversion from "./resources/Conversion.js";
import WorldGenerationParameters from "./world/WorldGenerationParameters.js";
import { QuestStage } from "./quests/QuestStage.js";
import { TutorialQuestUnpackLander } from "./quests/Quests.js";
import Technology from "./techtree/Technology.js";
import { ResearchableTechnologies } from "./techtree/TechTree.js";

// Holds the state of one run of the game, including the game world, inventory, and run statistics
export default class Game {
    readonly world: World;
    readonly inventory: Inventory;
    private questStage: QuestStage;
    private turnNumber: number = 1;

    private prevQuestDescription = "";
    public questCompletionShown: boolean = true;

    private completedTechs: Technology[] = [];

    private hasWon: boolean = false;
    private hasLost: boolean = false;

    constructor() {
        this.world = new World(WorldGenerationParameters.standardWorldParameters());
        this.inventory = new Inventory(this.world);
        this.questStage = TutorialQuestUnpackLander;
        this.hasWon = false;
        this.hasLost = false;
    }

    getCurrentQuestDescription(): string {
        return this.questStage.description;
    }

    getCurrentQuestHint(): string | undefined {
        return this.questStage.hint
    }

    getPreviousQuestDescription(): string {
        return this.prevQuestDescription;
    }

    // returns all available resource conversions in the order in which they will be applied
    getResourceConversions() {
        const allConversions: Conversion[] = Arrays.flatten(this.world.getTiles().map((tile: Tile) => tile.resourceConversions));
        // sort by priority number
        allConversions.sort((a: Conversion, b: Conversion) => (a.priority - b.priority));
        return allConversions;
    }

    updateQuestState() {
        const nextStage = this.questStage.updatedStage(this);
        if (nextStage != this.questStage) {
            this.prevQuestDescription = this.questStage.description;
            this.questCompletionShown = false;
            this.questStage = nextStage;
        }
    }

    hasUnlockedTechnology(tech: Technology): boolean {
        return this.completedTechs.includes(tech);
    }

    unlockTechnology(tech: Technology) {
        if (!this.hasUnlockedTechnology(tech)) {
            this.completedTechs.push(tech);
        }
    }

    getUnlockedTechnologies(): Technology[] {
        return this.completedTechs;
    }

    getResearchOptions(): Technology[] {
        return ResearchableTechnologies
            .filter(tech => tech.visible)
            .filter(tech => tech.requiredTechs.every(prerequisite => this.completedTechs.includes(prerequisite)))
            .filter(tech => !this.hasUnlockedTechnology(tech));
    }

    getHasWon(): boolean {
        return this.hasWon;
    }

    getHasLost(): boolean {
        return this.hasLost;
    }

    // this is called at the end of each turn
    completeTurn() {
        // calculate resource production
        this.inventory.applyConversions(this.getResourceConversions());

        this.inventory.releaseWorkers();
        this.inventory.doPopulationGrowth();

        this.turnNumber++;

        this.updateQuestState();
        this.hasWon = this.questStage.isWinState;
        this.hasLost = this.questStage.isLoseState;
    }

    // moves a resource conversion up by 1 in the production order
    increaseConversionPriority(conversion: Conversion) {
        if (conversion.priority == 0) {
            return; // priority #0 is for the free conversions (conversions with no inputs), which should not be moved to any other priority
        }

        const conversionsList = this.getResourceConversions();
        const index = conversionsList.indexOf(conversion);

        if (index == -1) {
            return; // conversion not found in the current world
        }
        else if (index == 0) {
            return; // already first in line
        }

        // swap priority number with the previous conversion
        const conversionAbove = conversionsList[index - 1];

        if (conversionAbove.priority == 0) {
            return; // can't move into priority 0 because only conversions with no inputs should be priority 0
        }
        [conversion.priority, conversionAbove.priority] = [conversionAbove.priority, conversion.priority];

    }

    // moves a resource conversion down by 1 in the production order
    decreaseConversionPriority(conversion: Conversion) {
        if (conversion.priority == 0) {
            return; // priority #0 is for the free conversions (conversions with no inputs), which should not be moved to any other priority
        }

        const conversionsList = this.getResourceConversions();
        const index = conversionsList.indexOf(conversion);

        if (index == -1) {
            return; // conversion not found in the current world
        }
        else if (index == (conversionsList.length - 1)) {
            return; // already first last in line
        }

        // swap priority number with the next conversion
        const conversionBelow = conversionsList[index + 1];
        [conversion.priority, conversionBelow.priority] = [conversionBelow.priority, conversion.priority];
    }
}
