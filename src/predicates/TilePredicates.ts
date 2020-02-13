import TilePredicate from "./TilePredicate.js";
import GridCoordinates from "../world/GridCoordinates.js";
import Game from "../Game.js";
import Tile, { NamedTileType } from "../world/Tile.js";



// file for implementations of TilePredicate

// predicate which checks whether the tile at the given coordinates is within a certain distance from at least one tile of a certain type
export class TileWithinDistancePredicate extends TilePredicate {
    constructor(
        public radius: number,
        public targetType: NamedTileType,
    ) {
        super();
    }

    evaluate(run: Game, position: GridCoordinates): boolean {
        const tilesInDistance: Tile[] = run.world.getTilesInCircle(position, this.radius);

        const matchingTilesInDistance = tilesInDistance.filter(tile => (tile instanceof this.targetType));
        return (matchingTilesInDistance.length > 0);
    }

    toString(): string {
        if (this.radius == 1) {
            return `adjacent to a ${this.targetType.tileName}`;
        } else {
            return `within ${this.radius} units of a ${this.targetType.tileName}`;
        }
    }
}

export class ConversionCountPredicate extends TilePredicate {
    constructor(
        private requiredCount: number
    ) {
        super();
    }

    evaluate(run: Game, position: GridCoordinates): boolean {
        return (run.world.getTileAtCoordinates(position).resourceConversions.length === this.requiredCount);
    }
    toString(): string {
        return `${this.requiredCount} resource conversions on this tile`;
    }
}
