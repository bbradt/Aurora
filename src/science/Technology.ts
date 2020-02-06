import Science from "./Science";
import ScienceCost from "./ScienceCost";

export default class Technology {
    // this class defines a technology which is implicitely organized
    // into a tree structure, based on a number of prerequisite other technologies 


    static readonly Engineering0 = new Technology("Engineering0", [], [ScienceCost.Free]);
    static readonly Engineering1 = new Technology("Engineering01", [Technology.Engineering0], [new ScienceCost(Science.Engineering, 1)]);
    static readonly Engineering2 = new Technology("Engineering02", [Technology.Engineering0], [new ScienceCost(Science.Engineering, 1)]);
    static readonly Engineering3 = new Technology("Engineering03", [Technology.Engineering1], [new ScienceCost(Science.Engineering, 1)]);

    private constructor(
        public readonly name: string,
        public readonly prerequisites: Technology[],
        public readonly costs: ScienceCost[]  // probably better to refactor this as a Map?
    ) { }

    // returns a list of all species instances
    static values(): Technology[] {
        return Object.keys(Technology).map((k: string) => ((Technology as { [key: string]: any })[k] as Technology));
    }

}
