import Science from "./Science";

export default class ScienceCost {

    public static readonly Free = new ScienceCost(Science.Starting, 0);

    constructor(
        public science: Science,
        public quantity: number
    ) { }

    toString() {
        return `${this.science.name} x${this.quantity}`;
    }
}
