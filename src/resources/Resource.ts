export default class Resource {
    // all resource instances are defined here

    static readonly Energy = new Resource("⚡ Energy");
    static readonly Metal = new Resource("⛏ Metal Ore");
    static readonly BuildingMaterials = new Resource("🔩 Construction Parts");
    static readonly Electronics = new Resource("💡 Electronics");

    // knowledge types used to research technologies are also resources
    static readonly EngineeringKnowledge = new Resource("⚙️ Engineering Data");
    static readonly SocialKnowledge = new Resource("🧠 Psychological Data");


    // the constructor is private because the resources defined as static members above should be the only possible instances
    private constructor(
        public readonly name: string,
    ){}

    // returns a list of all resource instances
    static values(): Resource[] {
        return Object.keys(Resource).map((k: string) => ((Resource as { [key: string]: any;})[k] as Resource));
    }
}
