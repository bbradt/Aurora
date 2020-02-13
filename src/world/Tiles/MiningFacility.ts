import Tile from "../Tile.js";
import TileProject from "../../tileProjects/TileProject.js";
import GridCoordinates from "../GridCoordinates.js";
import Resource from "../../resources/Resource.js";
import Conversion from "../../resources/Conversion.js";
import Cost from "../../resources/Cost.js";
import { MiningFacilityTexture } from "../../UI/Images.js";
import Game from "../../Game.js";
import { TechPredicate } from "../../predicates/WorldPredicates.js";
import { IndustrialEngineeringTech } from "../../techtree/TechTree.js";
import { ConversionCountPredicate } from "../../predicates/TilePredicates.js";

export default class MiningFacility extends Tile {
    texture: HTMLImageElement = MiningFacilityTexture;

    constructor(position: GridCoordinates) {
        super(position);
    }

    resourceConversions = [
        new Conversion(
            [new Cost(Resource.Metal, 100)],
            [new Cost(Resource.BuildingMaterials, 100)],
            60,
        ),
        new Conversion(
            [new Cost(Resource.Metal, 100)],
            [new Cost(Resource.Electronics, 100)],
            30,
        )
    ];

    possibleProjects = [
        new TileProject(
            "Double Production Lines",
            (position: GridCoordinates, run: Game) => {
                // find this tile
                const thisTile = run.world.getTileAtCoordinates(position);
                // duplicate the same conversions that a newly build instance has
                for (const conversion of new MiningFacility(new GridCoordinates(0, 0)).resourceConversions) {
                    thisTile.resourceConversions.push(conversion);
                }
            },
            [
                new Cost(Resource.BuildingMaterials, 175),
                new Cost(Resource.Energy, 300),
            ],
            [],
            [
                new TechPredicate(IndustrialEngineeringTech),
                new ConversionCountPredicate(2),
            ]
        )
    ];

    static readonly tileName: string = "Ore Processing Center";
    getTileName(): string {
        return MiningFacility.tileName;
    }
}
