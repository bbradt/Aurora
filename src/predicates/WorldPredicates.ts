import WorldPredicate from "./WorldPredicate.js";
import Game from "../Game.js";
import Resource from "../resources/Resource.js";
import { NamedTileType } from "../world/Tile.js";
import Technology from "../techtree/Technology.js";

export class MinResourcePredicate extends WorldPredicate {
    constructor(
        private resource: Resource,
        private minQuantity: number,
    ){
        super();
    }

    evaluate(run: Game): boolean {
        return run.inventory.getResourceQuantity(this.resource) >= this.minQuantity;
    }
    toString(): string {
        return `have at least ${this.minQuantity} units of ${this.resource.name} in inventory`;
    }
}

export class MinTilePredicate extends WorldPredicate {
    constructor(
        private tileType: NamedTileType,
        private minQuantity: number,
    ){
        super();
    }

    evaluate(run: Game): boolean {
        const matchingTiles = run.world.getTiles().filter(tile => tile instanceof this.tileType);
        return (matchingTiles.length) >= this.minQuantity;
    }
    toString(): string {
        const plural: string = (this.minQuantity == 1) ? "" : "s";
        return `have at least ${this.minQuantity}  ${this.tileType.tileName} tile${plural}`;
    }
}

export class MinPopulationPredicate extends WorldPredicate {
    constructor(
        private minimumPopulation: number
    ) {
        super();
    }

    evaluate(run: Game): boolean {
        return run.inventory.getTotalPopulation() >= this.minimumPopulation;
    }

    toString(): string {
        return `have a total population of at least ${this.minimumPopulation}`;
    }


}

export class TechPredicate extends WorldPredicate {
    constructor(
        private tech: Technology,
    ) {
        super();
    }

    evaluate(run: Game): boolean {
        return run.hasUnlockedTechnology(this.tech);
    }
    toString(): string {
        return `have the ${this.tech.name} technology`;
    }
}
