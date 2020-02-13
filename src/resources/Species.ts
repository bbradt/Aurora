export default class Species {
    // all species instances are defined here
    static readonly Human = new Species("👩🏻‍🚀 Human Colonists", 0.1);
    static readonly Robot = new Species("🤖 Robots", 1);

    // the constructor is private because the resources defined as static members above should be the only possible instances
    private constructor(
        public readonly name: string,
        public readonly growthMultiplier: number, // % increase in population per turn
    ){}

    // returns a list of all species instances
    static values(): Species[] {
        return Object.keys(Species).map((k: string) => ((Species as { [key: string]: any;})[k] as Species));
    }
}
