import World from "../world/World";
import UI from "./UI.js";
import Wasteland from "../world/Tiles/Wasteland.js";
import AbstractTile from "../world/AbstractTile.js";
import Util from "../util/Util.js";

// class to manage the UI canvas that shows the map
export default class MapUI {
    world: World;
    worldCanvas: HTMLCanvasElement; // canvas containing the whole world (not shown directly to the user)
    viewCanvas: HTMLCanvasElement; // the canvas we actually show, containing the currently viewed area

    viewWidth: number = 10;
    viewHeight: number = 6;

    viewPositionX: number = 0; // x-coord of the top-left corner of the currently viewed area
    viewPositionY: number = 0; // y-coord of the top-left corner of the currently viewed area

    tileScale: number = 64; // pixels per tile (before being stretched)

    highlightedCoordinates: [number, number] | null = null; // [x, y] grid coordinates of the selected tile, or null if no tile is selected

    constructor(world: World) {
        this.world = world;

        // TODO change viewable area dimensions to scale with screen size?

        this.worldCanvas = UI.makeCanvas(this.world.width * this.tileScale, this.world.height * this.tileScale);
        let worldContext = this.worldCanvas.getContext('2d')!;

        // this is for debug reasons, to let us see when an area has failed to render
        worldContext.beginPath();
        worldContext.rect(0, 0, this.worldCanvas.width, this.worldCanvas.height);
        worldContext.fillStyle = "black";
        worldContext.fill();

        this.viewCanvas = UI.makeCanvas(this.viewWidth * this.tileScale, this.viewHeight * this.tileScale, ['map-canvas']);

        // attach click listener to for tile selection
        this.viewCanvas.addEventListener('click', ev => {

            let x = Math.floor((ev.pageX - this.viewCanvas.offsetLeft) * (this.viewWidth / this.viewCanvas.clientWidth)) + this.viewPositionX;
            let y = Math.floor((ev.pageY - this.viewCanvas.offsetTop) * (this.viewHeight / this.viewCanvas.clientHeight)) + this.viewPositionY;
        
            let targetTile = this.world.getTileAtCoordinates(x, y);
            
            this.selectTile(targetTile);

            //TODO update world screen sidebar
        });

        // render the starting area
        world.getTilesInRectangle(0, 0, this.viewWidth, this.viewHeight).forEach((tile: AbstractTile) => {
            this.rerenderTile(tile, true);
        });
        this.updateViewCanvas();

    }

    getViewCanvas() {
        return this.viewCanvas;
    }

    updateViewCanvas() {
        let context = this.viewCanvas.getContext('2d')!;
        let pixelWidth = this.viewWidth * this.tileScale;
        let pixelHeight = this.viewHeight * this.tileScale;
        context.drawImage(this.worldCanvas, this.viewPositionX * this.tileScale, this.viewPositionY * this.tileScale, pixelWidth, pixelHeight, 0, 0, pixelWidth, pixelHeight);
    }

    drawImageAtCoordinates(src: string, gridX: number, gridY: number, skipViewUpdate?: boolean) {
        let context = this.worldCanvas.getContext('2d')!;
        let image = new Image();
        image.onload = () => {
            context.drawImage(image, gridX * this.tileScale, gridY * this.tileScale, this.tileScale, this.tileScale);
            if(!skipViewUpdate) {
                this.updateViewCanvas();
            }
        }

        image.src = src;
        
    }

    // redraws the given tile at its selected location
    rerenderTile(tile: AbstractTile, skipViewUpdate?: boolean) {
        // draw tile
        this.drawImageAtCoordinates(tile.getImgSrc(), tile.xPosition, tile.yPosition);

        // draw highlight icon
        if ([tile.xPosition, tile.yPosition] === this.highlightedCoordinates) {
            this.drawImageAtCoordinates("assets/ui/highlight.png", tile.xPosition, tile.yPosition, skipViewUpdate);
        }
    }

    selectTile(tile: AbstractTile | null) {

        // deselect previous highlight
        if (this.highlightedCoordinates) {
            let [prevX, prevY] = this.highlightedCoordinates;
            let prevSelection = this.world.getTileAtCoordinates(prevX, prevY);
            this.highlightedCoordinates = null;
            this.rerenderTile(prevSelection);
        }

        // highlight new tile
        if (tile) {
            this.drawImageAtCoordinates("assets/ui/highlight.png", tile.xPosition, tile.yPosition);
            this.highlightedCoordinates = [tile.xPosition, tile.yPosition];
        } else {
            this.highlightedCoordinates = null;
        }
    }

    handleKeyDown(ev: KeyboardEvent) {
        let code = ev.code;
        if(code === "ArrowUp" || code === "KeyW") {
            this.moveViewArea(0, -1);
        }
        if(code === "ArrowLeft" || code === "KeyA") {
            this.moveViewArea(-1, 0);
        }
        if(code === "ArrowDown" || code === "KeyS") {
            this.moveViewArea(0, 1);
        }
        if(code === "ArrowRight" || code === "KeyD") {
            this.moveViewArea(1, 0);
        }
    }

    private moveViewArea(right: number, down: number) {
        let oldPositionX = this.viewPositionX;
        let oldPositionY = this.viewPositionY;

        this.viewPositionX = Util.clamp(0, this.viewPositionX + right, this.world.width - this.viewWidth);
        this.viewPositionY = Util.clamp(0, this.viewPositionY + down, this.world.height - this.viewHeight);
        console.log(`moved view area to ${this.viewPositionX}, ${this.viewPositionY}`);

        right = this.viewPositionX - oldPositionX;
        down = this.viewPositionY - oldPositionY;

        // make sure that the are we're moving into has been rendered
        if (right > 0) {
            this.world.getTilesInRectangle((this.viewPositionY), (this.viewPositionX + this.viewWidth - right),  right, this.viewHeight)
                .forEach((tile: AbstractTile) => this.rerenderTile(tile, true));
        }
        if (right < 0) {
            this.world.getTilesInRectangle((this.viewPositionY), (this.viewPositionX),  right * -1, this.viewHeight)
                .forEach((tile: AbstractTile) => this.rerenderTile(tile, true));
        }
        if (down > 0) {
            this.world.getTilesInRectangle((this.viewPositionY + this.viewHeight - down), (this.viewPositionX),  this.viewWidth, down)
                .forEach((tile: AbstractTile) => this.rerenderTile(tile, true));
        } if (down < 0) {
            this.world.getTilesInRectangle((this.viewPositionY), (this.viewPositionX),  this.viewWidth, down * -1)
                .forEach((tile: AbstractTile) => this.rerenderTile(tile, true));
        }

        this.updateViewCanvas();
    }
}   