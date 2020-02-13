import { UI } from "../UI.js";
import { GameWindow, Page } from "../GameWindow.js";
import MainMenu from "./MainMenu.js";


class CreditsEntry {
    constructor(public name: string, public roles: string[]){}
}

const credits: CreditsEntry[] = [
    new CreditsEntry("Grace Rarer", ["Team Lead", "Gameplay Programmer"]),
    new CreditsEntry("Prindle", ["DevOps"]), // <3
    new CreditsEntry("May Lawver", ["Programmer (HTML Composition Code)"]),
];

// this may need to become a real class in the future
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class CreditsScreen implements Page {

    readonly html: HTMLElement;
    constructor() {
        this.html = UI.makeDiv(["credits"]);
        this.refresh();
    }

    refresh(): void {
        const nameParas: HTMLElement[] = credits.map(entry => UI.makePara(entry.name, ["credits-name"]));
        const roleParas: HTMLElement[] = credits.map(entry => UI.makePara(entry.roles.join(", "), ["credits-roles"]));

        UI.fillHTML(this.html, [
            UI.makeHeader("Credits", 1),
            UI.makeDivContaining([
                UI.makeDivContaining(nameParas, ["credits-names-column"]),
                UI.makeDivContaining(roleParas),
            ], ["credits-container"]),
            UI.makeButton("Back", () => GameWindow.show(new MainMenu())),
        ]);
    }
}
