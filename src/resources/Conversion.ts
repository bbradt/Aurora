import Cost from "./Cost.js";
import { NonEmptyArray } from "../util/Arrays.js";

// a conversion from input resources to output resources that a tile can perform between turns if the conversion's input resources are available
export default class Conversion {

    private static nextNumber = 1; // the initial priority of the next non-free conversion that will be created

    /* conversions are sorted by priority to determine the order in which conversions are applied
     * lower numbered conversions are applied first; conversions with no inputs are priority 0
     * because they should always be applied before any other conversions
     */
    public priority: number;
    public enabled: boolean = true; // conversion will be skipped when disabled
    public readonly requiredWorkers: number;

    constructor(
        public readonly inputs: Cost[],
        public readonly outputs: NonEmptyArray<Cost>,
        workers?: number,
    ) {
        this.requiredWorkers = workers || 0;
        if (this.isFree()) {
            this.priority = 0;
        } else {
            this.priority = Conversion.nextNumber;
            Conversion.nextNumber++;
        }
    }

    toString(): string {
        const outputDescription = this.outputs.map((output: Cost) => output.toString()).join(", ");
        let description = `Produce ${outputDescription}`;
        if (this.inputs.length > 0) {
            const inputDescription = this.inputs.map((input: Cost) => input.toString()).join(", ");
            description = `Convert ${inputDescription} into ${outputDescription}`;
        }
        if (this.requiredWorkers != 0) {
            description = description + ` using ${this.requiredWorkers} workers`;
        }

        return description;
    }

    isFree(): boolean {
        return (this.inputs.length == 0) && (!this.requiredWorkers);
    }
}
