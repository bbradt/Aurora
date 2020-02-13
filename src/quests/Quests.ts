// quests need to be able to indirectly reference the following quest(s)
/* eslint-disable @typescript-eslint/no-use-before-define */

import { QuestStage, QuestPath } from "./QuestStage.js";
import Resource from "../resources/Resource.js";
import { MinResourcePredicate, MinTilePredicate, MinPopulationPredicate } from "../predicates/WorldPredicates.js";
import Habitat from "../world/Tiles/Habitat.js";
import SolarPanels from "../world/Tiles/SolarArray.js";
import Lander from "../world/Tiles/Lander.js";
import GridCoordinates from "../world/GridCoordinates.js";

export const TutorialQuestUnpackLander: QuestStage = new QuestStage(
    "Deploy shelter for the colonists",
    `select the ${Lander.tileName}`,
    [
        new QuestPath(
            new MinTilePredicate(Habitat, 1),
            () => TutorialQuestGetEnergy,
        )
    ],
);

export const TutorialQuestGetEnergy: QuestStage = new QuestStage(
    `Build up at least 100 units of ${Resource.Energy.name}`,
    `the ${SolarPanels.tileName} produces ${Resource.Energy.name} each turn`,
    [
        new QuestPath(
            new MinResourcePredicate(Resource.Energy, 100),
            () => TutorialQuestGetOre,
        )
    ],
);

export const TutorialQuestGetOre: QuestStage = new QuestStage(
    `Acquire ${Resource.Metal.name}`,
    undefined,
    [
        new QuestPath(
            new MinResourcePredicate(Resource.Metal, 1),
            () => TutorialQuestPopulation200,
        )
    ],
);

export const TutorialQuestPopulation200: QuestStage = new QuestStage(
    "Grow total worker population to 250",
    `A ${Habitat.tileName} has capacity for ${new Habitat(new GridCoordinates(0, 0)).populationCapacity.capacity} colonists`,
    [
        new QuestPath(
            new MinPopulationPredicate(250),
            () => UnwinnableQuestStage,
        )
    ],
);

export const UnwinnableQuestStage: QuestStage = new QuestStage(
    "[no current objective]",
    undefined,
    [],
);
