import Resource from "../resources/Resource.js";
import Game from "../Game.js";
import Species from "../resources/Species.js";
import { GameWindow } from "../UI/GameWindow.js";
import { GameOverStage, VictoryStage } from "../quests/Quests.js";

// container for cheat methods for debugging/testing via the browser console
class Cheats {
    constructor(
        private currentGame: Game,
    ) { }

    // call this to update game and ui after each cheat's effect
    refresh(): void {
        this.currentGame.updateQuestState();
        GameWindow.refreshCurrentPage();
    }

    addResource(resource: Resource, quantity: number): void {
        this.currentGame.inventory.addResource(resource, quantity);
        this.refresh();
    }

    addPopulation(species: Species, quantity: number): void {
        this.currentGame.inventory.addWorkers(species, quantity);
        this.refresh();
    }

    loseGame(): void {
        this.currentGame.setQuestStage(GameOverStage);
    }

    winGame(): void {
        this.currentGame.setQuestStage(VictoryStage);
    }
}

// makes cheat methods available from the console
export function enableCheats(run: Game): void {

    const cheatsObject = new Cheats(run);
    const theWindow: any = window;
    theWindow.cheatsAddResource = (resource: Resource, quantity: number) => cheatsObject.addResource(resource, quantity);
    theWindow.cheatsAddPopulation = (species: Species, quantity: number) => cheatsObject.addPopulation(species, quantity);
    theWindow.cheatsLoseGame = () => cheatsObject.loseGame();
    theWindow.cheatsWinGame = () => cheatsObject.winGame();

    // these classes also need to be made globally accessible so their instances can be used as parameters for cheats
    // we freeze the constructors so the existing instances can't be modified
    // unfortunately, this still makes it possible for players to construct new instances of the multitons that are supposed to be constant
    Object.freeze(Resource);
    Object.freeze(Species);
    theWindow.Resources = Resource;
    theWindow.Species = Species;
}
