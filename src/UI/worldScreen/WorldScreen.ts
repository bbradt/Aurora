import { UI } from "../UI.js";
import MapUI from "./MapUI.js";
import TileSidebar from "./TileSidebar.js";
import GridCoordinates from "../../world/GridCoordinates.js";
import Game from "../../Game.js";
import InventorySidebar from "./InventorySidebar.js";
import WorldScreenHeader from "./WorldScreenHeader.js";
import { Page } from "../GameWindow.js";

/* The class associated with the "world screen"
 * which shows the map grid, available resources, and options for the selected structure
 */
export default class WorldScreen implements Page {

    private mapUI: MapUI;
    private inventorySidebar: InventorySidebar;
    private tileSidebar: TileSidebar;
    private header: WorldScreenHeader;
    readonly html: HTMLElement;

    constructor(run: Game) {
        this.mapUI = new MapUI(this, run.world);
        this.tileSidebar = new TileSidebar(this, run);

        const mapHTML = this.mapUI.getViewCanvas();
        this.inventorySidebar = new InventorySidebar(run);
        const tileSidebarHTML = this.tileSidebar.getHTML();
        const inventoryHTML = this.inventorySidebar.getHTML();
        this.header = new WorldScreenHeader(run);

        this.html = UI.makeDivContaining([

            this.header.getHTML(),

            UI.makeDivContaining([
                inventoryHTML,
                UI.makeDivContaining([mapHTML], ["world-screen-map-box"]),
                tileSidebarHTML,
            ], ["world-screen-hbox"]),

        ], ["flex-vertical"]);
    }

    refresh(): void {
        this.mapUI.refreshViewableArea();
        this.tileSidebar.refresh();
        this.inventorySidebar.refresh();
        this.header.refresh();
    }

    // keyboard events for this page are passed to the map ui, which uses arrow keys or wasd to move around the map
    handleKeyDown(ev: KeyboardEvent): void {
        this.mapUI.handleKeyDown(ev);
    }

    changeSidebarTile(position: GridCoordinates | null): void {
        this.tileSidebar.changeTile(position);
    }
}
