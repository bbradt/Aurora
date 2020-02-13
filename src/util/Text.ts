// The browser will ignore tabs and repeated spaces in paragraph blocks
// so we replace them with non-breaking-space characters
export function indentWithNBS(str: string):  string {
    const fakeTab = "\u00A0".repeat(4);

    str = str.replace(/\t/g, fakeTab);
    str = str.replace(/ {4}/g, fakeTab);
    return str;
}

/*
 * A tagged template literal function for processing indented multiline strings.
 * This takes a template literal as an argument, called with the following
 * syntax:
 *
 *     let str = stripIndent`
 *         A multiline template string
 *         Each line may be indented
 *             This line will still be indented by four spaces`;
 *
 * Regular multiline templates do not remove any indentation. This will process
 * the template and strip extra indentation from the beginning of each line.
 */
export function stripIndent(strings: TemplateStringsArray, ...placeholders: string[]): string {
    // Remove leading/trailing newlines and concatenate arguments, accounting
    // for tabs as indentation
    let str = strings
        .reduce((acc, s, i) => acc + s + (placeholders[i] || ""))
        .replace(/\t/, "    ")
        .replace(/^(?:\r?\n)+|(?:\r?\n)+$/g, "");
    // Split into lines and find the indentation levels of all nonempty ones
    const lines = str.split(/\r?\n/);
    const indentLevels = lines
        .filter(line => line !== "")
        .map(line => line.match(/^\s*/)![0].length); // regex can't fail to match
    // Find the minimum indentation across all nonempty lines
    let minIndent = 0;
    if (lines.length > 0) {
        minIndent = indentLevels.reduce((min, len) => Math.min(min, len));
    }
    // Drop the minimum indent size from every line and join them back
    // together
    if (minIndent > 0) {
        const strippedLines = lines.map(str => str.substring(minIndent));
        return strippedLines.join("\n");
    } else {
        return lines.join("\n");
    }
}