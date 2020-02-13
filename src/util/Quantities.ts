/* Counts positive quantities of instances of some type.
 * e.g. the amounts of each resource in the inventory
 *
 * Quantities that reach 0 are removed, so having 0 of something
 * and not having the thing at all are the same thing.
 * Setting negative quantities is disallowed and will result in a runtime exception.
 */
export default class Quantities<T> {
    private map: Map<T, number> = new Map<T, number>([]);

    constructor(){}

    add(key: T, quantity: number): void {
        this.set(key, this.get(key) + quantity);
    }

    remove(key: T, quantity: number): void {
        this.add(key, quantity * -1);
    }

    get(key: T): number {
        return this.map.get(key) || 0;
    }

    set(key: T, quantity: number): void {
        if (quantity < 0) {
            throw "tried to set quantity to negative value";
        }
        if (quantity == 0) {
            this.map.delete(key);
        } else {
            this.map.set(key, quantity);
        }
    }

    getSum(): number {
        return (Array.from(this.map.values())).reduce((sum: number, current: number) => (sum + current), 0);
    }

    // all of the keys in the backing map should be associated with positive values
    positiveQuantityKeys(): T[] {
        return Array.from(this.map.keys());
    }

    clone(): Quantities<T> {
        const copy = new Quantities<T>();
        for (const key of this.positiveQuantityKeys()) {
            copy.add(key, this.get(key));
        }
        return copy;
    }
}
