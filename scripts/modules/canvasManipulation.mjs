export class CanvasManipulator {
    placeteam = null;
    mouseState = null;

    constructor(placeteam, mouseState) {
        this.placeteam = placeteam;
        this.mouseState = mouseState;
    }

    SetPixel(x, y, color) {    
        this.placeteam.ctx.fillStyle = color;
        this.placeteam.ctx.fillRect(x, y, 1, 1);
    };

    // Place pixel on clicked part of canvas
    PlacePixelOnCanvas(event) {
        let mouseCoordinates = this.placeteam.getCoordinateslAtMouse(event);
        this.SetPixel(mouseCoordinates.x, mouseCoordinates.y, this.placeteam.colors[this.placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid]);
    }
}