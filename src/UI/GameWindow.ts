import { UI } from "./UI.js";

export interface Page {
    // root element containing this page's HTML
    readonly html: HTMLElement;
    // updates the information shown on the page (may be a no-op for pages that don't show changing information)
    refresh(): void;

    // pages make optionally implement one or both of these methods in order to receive keyboard input
    handleKeyDown?(event: KeyboardEvent): void;
    handleKeyUp?(event: KeyboardEvent): void;
}

export namespace GameWindow {

    // root div for all of our HTML
    const rootDiv: HTMLElement = document.getElementById("rootdiv")!;

    // currently-displayed page
    let currentPage: Page | undefined = undefined;

    export function show(page: Page): void {
        currentPage = page;
        UI.fillHTML(rootDiv, [page.html]);

        // keyboard handlers will only be called on pages that include them
        document.onkeydown = (ev: KeyboardEvent) => {
            if (page.handleKeyDown) {
                page.handleKeyDown(ev);
            }
        };
        document.onkeyup = (ev: KeyboardEvent) => {
            if (page.handleKeyUp) {
                page.handleKeyUp(ev);
            }
        };
    }

    export function refreshCurrentPage(): void {
        if (currentPage) {
            currentPage.refresh();
        }
    }
}
