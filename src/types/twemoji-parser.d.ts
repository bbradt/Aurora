declare module "twemoji-parser" {
    export type EmojiEntity = {
        type: string;
        text: string;
        url: string;
        indices: number[];
    };
    export type ParsingOptions = {
        buildUrl?: (codepoints: string, assetType: string) => string;
        assetType?: "png" | "svg";
    };
    export function parse(text: string, options?: ParsingOptions): EmojiEntity[];
    export function toCodePoints(unicodeSurrogates: string): string[];
    export const TypeName: "emoji";
}
