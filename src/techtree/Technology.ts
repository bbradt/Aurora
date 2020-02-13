import Cost from "../resources/Cost.js";
import { ResearchableTechnologies } from "./TechTree.js";

export default class Technology {
    private constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly requiredTechs: Technology[],
        public readonly researchCost: Cost,
        public readonly visible: boolean = true,
    ){}

    static makeUnlockableTechnology(name: string, description: string, requiredTechs: Technology[], researchCost: Cost): Technology {
        const newTech = new Technology(name, description, requiredTechs, researchCost, true);
        ResearchableTechnologies.push(newTech);
        return newTech;
    }

    // hidden technologies cannot be unlocked through the tech tree, but can be used for scripted actions
    static makeHiddenTechnology(name: string, description: string, researchCost: Cost, visible: boolean = false): Technology {
        return new Technology(name, description, [], researchCost, visible);
    }
}
