/* random number generation helper methods
 * adapted from Prototype Inheritance by May Lawver
 */
export namespace Random {

    // random real number (almost always non-integer) within the given range
    export function realBetween(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    // random integer within the given range
    export function intBetween(min: number, max: number): number {
        return Math.floor(realBetween(min, max));
    }

    // randomly selected element from an array
    export function fromArray<T>(arr: T[]): T {
        return arr[intBetween(0, arr.length)];
    }
}
