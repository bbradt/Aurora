import World from "./world/World.js";
import Inventory from "./resources/Inventory.js";
import Conversion from "./resources/Conversion.js";
import WorldGenerationParameters from "./world/WorldGenerationParameters.js";
import { QuestStage } from "./quests/QuestStage.js";
import { TutorialQuestUnpackLander } from "./quests/Quests.js";
import Technology from "./techtree/Technology.js";
import { ResearchableTechnologies } from "./techtree/TechTree.js";
import { Arrays } from "./util/Arrays.js";
import { GameWindow } from "./UI/GameWindow.js";
import EndScreen from "./UI/endScreen/EndScreen.js";

// Holds the state of one run of the game, including the game world, inventory, and run statistics
export default class Game {
    readonly world: World;
    readonly inventory: Inventory;
    private questStage: QuestStage;
    private turnNumber: number = 1;

    private prevQuestDescription = "";
    public questCompletionShown: boolean = true;

    private completedTechs: Technology[] = [];

    constructor() {
        this.world = new World(WorldGenerationParameters.standardWorldParameters());
        this.inventory = new Inventory(this.world);
        this.questStage = TutorialQuestUnpackLander;
    }

    getCurrentQuestDescription(): string {
        return this.questStage.description;
    }

    getCurrentQuestHint(): string | undefined {
        return this.questStage.hint;
    }

    getPreviousQuestDescription(): string {
        return this.prevQuestDescription;
    }

    // this method violates the privacy of quest-stage, but is needed for cheats to set quest stages
    setQuestStage(questStage: QuestStage): void {
        this.questStage = questStage;
    }

    private getUnorderedConversions(): Conversion[] {
        return Arrays.flatten(this.world.getTiles().map(tile => tile.resourceConversions));
    }

    // Returns all available free and costly resource conversions in the order
    // in which they will be applied, as two separate arrays
    getResourceConversions(): { free: Conversion[]; costly: Conversion[]; } {
        const allConversions = this.getUnorderedConversions();
        const { yes: free, no: costly } = Arrays.partition(allConversions, c => c.isFree());
        // sort by priority number
        free.sort((a, b) => a.priority - b.priority);
        costly.sort((a, b) => a.priority - b.priority);
        return { free, costly };
    }

    // Returns all resource conversions in the order in which they will be
    // applied; i.e., all free conversions first, followed by costly conversions
    // in decreasing order of priority.
    getAllResourceConversions(): Conversion[] {
        const allConversions = this.getUnorderedConversions();
        // sort by priority number
        allConversions.sort((a, b) => a.priority - b.priority);
        return allConversions;
    }

    updateQuestState(): void {
        const nextStage = this.questStage.updatedStage(this);
        if (nextStage != this.questStage) {
            this.prevQuestDescription = this.questStage.description;
            this.questCompletionShown = false;
            this.questStage = nextStage;
        }
        if (this.questStage.endState) {
            GameWindow.show(new EndScreen(this.questStage.endState));
        }
    }

    hasUnlockedTechnology(tech: Technology): boolean {
        return this.completedTechs.includes(tech);
    }

    unlockTechnology(tech: Technology): void {
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

    // this is called at the end of each turn
    completeTurn(): void {
        // calculate resource production
        this.inventory.applyConversions(this.getAllResourceConversions());

        this.inventory.releaseWorkers();
        this.inventory.doPopulationGrowth();

        this.turnNumber++;

        this.updateQuestState();
    }

    // Moves a costly conversion to a different point in the order of
    // priorities.
    shiftCostlyConversionPriority(fromIndex: number, toIndex: number): void {
        if (fromIndex === toIndex || fromIndex < 0) {
            return;
        }

        const { costly } = this.getResourceConversions();
        if (toIndex >= costly.length) {
            return;
        }

        // The priority of toIndex after shifting intermediate priorities
        const priority = costly[toIndex].priority;
        if (fromIndex < toIndex) {
            // Shift intermediate priorities up
            for (let i = toIndex; i > fromIndex; i--) {
                costly[i].priority = costly[i - 1].priority;
            }
        } else {
            // Shift intermediate priorities down
            for (let i = toIndex; i < fromIndex; i++) {
                costly[i].priority = costly[i + 1].priority;
            }
        }
        costly[fromIndex].priority = priority;
    }
}
