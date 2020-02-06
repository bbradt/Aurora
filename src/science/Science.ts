export default class Science {
    // all resource instances are defined here
    static readonly Starting = new Science("Starting");
    static readonly Xenotechnology = new Science("Xenotechnology");
    static readonly Engineering = new Science("Engineering");
    static readonly Social = new Science("Social");

    // the constructor is private because the resources defined as static members above should be the only possible instances
    private constructor(
        public readonly name: string,
    ) { }

    // returns a list of all resource instances
    static values(): Science[] {
        return Object.keys(Science).map((k: string) => ((Science as { [key: string]: any })[k] as Science));
    }
}
