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
}