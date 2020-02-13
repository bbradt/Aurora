import World from "../../world/World.js";
import { UI } from "../UI.js";
import Tile from "../../world/Tile.js";
import { clamp } from "../../util/Util.js";
import GridCoordinates from "../../world/GridCoordinates.js";
import WorldScreen from "./WorldScreen.js";
import { HighlightSelectionImage } from "../Images.js";

// class to manage the UI canvas that shows the map
export default class MapUI {

    private static pixelsPerTile: number = 64;

    private static highlightImage: HTMLImageElement = HighlightSelectionImage;

    private world: World;

    private canvas: HTMLCanvasElement; // an html canvas that we draw tiles onto
    private parentScreen: WorldScreen; // the WorldScreen instance that contains this MapUI

    private viewWidth: number = 12; // width of viewable area in tiles
    private viewHeight: number = 8; // height of viewable area in tiles

    private viewPosition: GridCoordinates = new GridCoordinates(0, 0); // coordinates of the current view area's top-left tile
    private highlightedCoordinates: GridCoordinates | null = null; // coordinates of current selected tile, null if no tile is selected

    constructor(parent: WorldScreen, world: World) {
        this.world = world;
        this.parentScreen = parent;

        this.canvas = UI.makeCanvas(this.viewWidth * MapUI.pixelsPerTile, this.viewHeight * MapUI.pixelsPerTile, ["map-canvas"]);

        // attach click listener for tile selection
        this.canvas.addEventListener("click", ev => this.handleClick(ev));

        // render the starting area
        this.refreshViewableArea();
    }

    getViewCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public refreshViewableArea(): void {
        const tilesInViewableArea = this.world.getTilesInRectangle(this.viewPosition.x, this.viewPosition.y, this.viewWidth, this.viewHeight);
        for (const tile of tilesInViewableArea)  {
            this.rerenderTile(tile);
        }
    }

    private drawSquareAtCoordinates(image: HTMLImageElement, coordinates: GridCoordinates): void {
        const context = this.canvas.getContext("2d")!;
        context.imageSmoothingEnabled = false; // disable antialiasing to allow crispy pixel art

        const x = coordinates.x - this.viewPosition.x;
        const y = coordinates.y - this.viewPosition.y;

        if ((x < 0) || (y<0) || (x >= this.viewWidth) || (y >= this.viewHeight)) {
            return; // don't attempt to draw tiles outside the viewable area
        }

        context.drawImage(image, x * MapUI.pixelsPerTile, y * MapUI.pixelsPerTile, MapUI.pixelsPerTile, MapUI.pixelsPerTile);
    }

    // redraws the given tile at that tile's position
    private rerenderTile(tile: Tile): void {
        this.drawSquareAtCoordinates(tile.texture, tile.position);
        if (tile.position === this.highlightedCoordinates) {
            this.drawSquareAtCoordinates(MapUI.highlightImage, tile.position);
        }
    }

    private selectTile(tile: Tile | null): void {
        if (tile && tile.position === this.highlightedCoordinates) {
            return; // ignore selecting a tile that is already selected
        }

        // deselect previous highlight
        if (this.highlightedCoordinates) {
            const prevSelection = this.world.getTileAtCoordinates(this.highlightedCoordinates);
            this.highlightedCoordinates = null;
            this.rerenderTile(prevSelection);
        }

        // highlight new tile
        if (tile) {
            this.drawSquareAtCoordinates(MapUI.highlightImage, tile.position);
            this.highlightedCoordinates = tile.position;
        } else {
            this.highlightedCoordinates = null;
        }

        this.parentScreen.changeSidebarTile(this.highlightedCoordinates);
    }

    private moveViewArea(right: number, down: number): void {
        const oldX = this.viewPosition.x;
        const oldY = this.viewPosition.y;

        const newX = clamp(0, this.viewPosition.x + right, this.world.width - this.viewWidth);
        const newY = clamp(0, this.viewPosition.y + down, this.world.height - this.viewHeight);
        this.viewPosition = new GridCoordinates(newX, newY);

        right = this.viewPosition.x - oldX;
        down = this.viewPosition.y - oldY;

        // move existing canvas pixels
        const translateX = right * MapUI.pixelsPerTile * -1;
        const translateY = down * MapUI.pixelsPerTile * -1;
        const context = this.canvas.getContext("2d")!;
        context.drawImage(this.canvas, translateX, translateY);

        // rerender newly visible tiles
        if (right > 0) {
            const newTiles = this.world.getTilesInRectangle((this.viewPosition.x + this.viewWidth - right), (this.viewPosition.y),  right, this.viewHeight);
            for (const tile of newTiles) {
                this.rerenderTile(tile);
            }
        }
        if (right < 0) {
            const newTiles = this.world.getTilesInRectangle((this.viewPosition.x), (this.viewPosition.y),  right * -1, this.viewHeight);
            for (const tile of newTiles) {
                this.rerenderTile(tile);
            }
        }
        if (down > 0) {
            const newTiles = this.world.getTilesInRectangle((this.viewPosition.x), (this.viewPosition.y + this.viewHeight - down),  this.viewWidth, down);
            for (const tile of newTiles) {
                this.rerenderTile(tile);
            }
        } if (down < 0) {
            const newTiles = this.world.getTilesInRectangle((this.viewPosition.x), (this.viewPosition.y),  this.viewWidth, down * -1);
            for (const tile of newTiles) {
                this.rerenderTile(tile);
            }
        }
    }

    handleClick(ev: MouseEvent): void {
        const x = Math.floor((ev.pageX - this.canvas.offsetLeft) * (this.viewWidth / this.canvas.clientWidth)) + this.viewPosition.x;
        const y = Math.floor((ev.pageY - this.canvas.offsetTop) * (this.viewHeight / this.canvas.clientHeight)) + this.viewPosition.y;

        const targetTile = this.world.getTileAtCoordinates(new GridCoordinates(x, y));
        this.selectTile(targetTile);
    }

    handleKeyDown(ev: KeyboardEvent): void {
        const code = ev.code;
        if (code === "ArrowUp" || code === "KeyW") {
            this.moveViewArea(0, -1);
        }
        if (code === "ArrowLeft" || code === "KeyA") {
            this.moveViewArea(-1, 0);
        }
        if (code === "ArrowDown" || code === "KeyS") {
            this.moveViewArea(0, 1);
        }
        if (code === "ArrowRight" || code === "KeyD") {
            this.moveViewArea(1, 0);
        }
    }
}
