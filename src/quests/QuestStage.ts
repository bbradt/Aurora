import WorldPredicate from "../predicates/WorldPredicate.js";
import Game from "../Game.js";

export class QuestPath {
    constructor(
        readonly requirement: WorldPredicate,
        readonly nextStage: () => QuestStage,
    ) { }
}

export class QuestStage {
    constructor(
        readonly description: string,
        readonly hint: string | undefined,
        readonly paths: QuestPath[],
        readonly isWinState = false,
        readonly isLoseState = false,
    ) { }

    // returns the next stage if an advancement path requirement is met, otherwise returns this stage
    updatedStage(run: Game): QuestStage {
        for (const path of this.paths) {
            if (path.requirement.evaluate(run)) {
                return path.nextStage().updatedStage(run); // recursion to automatically skip over stages whose requirements are already met
            }
        }

        return this;
    }
}
