import Tile from "./Tile.js";
import GridCoordinates from "./GridCoordinates.js";
import Wasteland from "./Tiles/Wasteland.js";
import Mountain from "./Tiles/Mountain.js";
import Lander from "./Tiles/Lander.js";

export default class WorldGenerationParameters {
    constructor(
        public nonrandomTiles: Tile[], // tiles which are set to always be in a certain position rather than randomized
        public worldWidth: number,
        public worldHeight: number,
        public minMountains: number,
        public maxMountains: number,
    ) {}

    static standardWorldParameters(): WorldGenerationParameters {
        const nonrandomTiles = [
            new Mountain(new GridCoordinates(0, 0)),
            new Mountain(new GridCoordinates(1, 0)),
            new Mountain(new GridCoordinates(2, 0)),

            new Wasteland(new GridCoordinates(0, 1)),
            new Wasteland(new GridCoordinates(1, 1)),
            new Wasteland(new GridCoordinates(2, 1)),

            new Wasteland(new GridCoordinates(0, 2)),
            new Lander(new GridCoordinates(1, 2)),
            new Wasteland(new GridCoordinates(2, 2)),

            new Wasteland(new GridCoordinates(0, 3)),
            new Wasteland(new GridCoordinates(1, 3)),
            new Wasteland(new GridCoordinates(2, 4)),
        ];

        return new WorldGenerationParameters(
            nonrandomTiles,
            20, 20, // world width and height
            20, 25, // min and max number of randomly-placed mountains
        );
    }
}
