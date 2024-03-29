export class CanvasManipulator {
    placeteam = null;
    mouseState = null;
    placeteamWebSocket =null;

    constructor(placeteam, mouseState, placeteamWebSocket) {
        this.placeteam = placeteam;
        this.mouseState = mouseState;
        this.placeteamWebSocket = placeteamWebSocket;
    }

    SetPixel(x, y, color) {    
        if (color == null) {
            color = "#ffffff";
        }
        this.placeteam.ctx.fillStyle = color;
        this.placeteam.ctx.fillRect(x, y, 1, 1);
    };

    // Place pixel on clicked part of canvas
    PlacePixelOnCanvas(event) {
        let mouseCoordinates = this.placeteam.getCoordinateslAtMouse(event);
        let x=mouseCoordinates.x;
        let y=mouseCoordinates.y;
        let color=this.placeteam.colors[this.placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid];
        if(this.placeteam.cooldown < 1){
            this.placeteamWebSocket.Set(x,y,color);
            this.SetPixel(x, y, color);
        }        
    }

    GetCanvasWidthPercentageInt() {
        return parseInt(this.placeteam.canvas.style.width.match(/(\d+)/));
    }
    
    GetPixelSize() {
        return this.placeteam.canvas.clientWidth / this.placeteam.canvas.width;
    }
}