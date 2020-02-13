// enforces compile-tile check that an array have at least one element
export type NonEmptyArray<T> = [T, ...T[]];

export namespace Arrays {
    // creates a list of the desired length, filling it with values produced by the given function
    export function generate<T>(length: number, func: () => T): T[] {
        const result: T[] = new Array(length);
        for (let i = 0; i < length; i++) {
            result[i] = func();
        }
        return result;
    }

    // create a 1-dimensional array containing all of the elements from a 2-dimensional array
    export function flatten<T>(arr: T[][]): T[] {
        return arr.reduce((acc, x) => acc.concat(x), []);
    }

    // Given an array, return all elements that do and do not satisfy the
    // predicate
    export function partition<T>(arr: T[], pred: (elem: T) => boolean): { yes: T[]; no: T[]; } {
        const yes = [];
        const no = [];
        for (const x of arr) {
            if (pred(x)) {
                yes.push(x);
            } else {
                no.push(x);
            }
        }
        return { yes, no };
    }
}
