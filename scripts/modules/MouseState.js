export class MouseState {
    placeteam = null;
    canvasManipulator = null;
    colorChanger = null;

    mouseIsDown = false;
    rightclickIsDown = false;
    lastMouseDown = 0;

    constructor(placeteam,colorChanger) {
        this.placeteam = placeteam;
        this.colorChanger = colorChanger;
    }

    SetCanvasManipulator(canvasManipulator) {
        this.canvasManipulator = canvasManipulator;
    }

    SetEvents() {
        this.SetMouseDownEvent()
        this.SetMouseUpEvent();
        this.DisableContextMenuEvent();
        this.handleWindowLeave();
    }

    handleWindowLeave(){
        document.documentElement.addEventListener('mouseleave', function(event){ 
            const _self = this;
            _self.mouseIsDown = false;
        });
    }
    SetMouseDownEvent() {
        const _self = this;
        this.placeteam.canvas.addEventListener('mousedown', function(event) {

            if(event.which == 1){//left click
                _self.lastMouseDown = Date.now();   
                _self.mouseIsDown = true;
                _self.ChangeCanvasCursor('grab');
            }
            else if (event.which == 3){//right click                   
                _self.rightclickIsDown = true;
                _self.ChangeCanvasCursor('crosshair');                
                const mouseCoordinates = _self.placeteam.getCoordinateslAtMouse(event);
                const rgbArray = _self.placeteam.ctx.getImageData(mouseCoordinates.x, mouseCoordinates.y, 1, 1).data; 
                _self.colorChanger.ChangeColor(_self.RgbToHex(rgbArray[0],rgbArray[1],rgbArray[2]), _self.placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid);
            }
        });
    }
    SetMouseUpEvent() {
        const _self = this;
        this.placeteam.canvas.addEventListener('mouseup', function(event) {
            if (Date.now() - _self.lastMouseDown < _self.placeteam.maximumClickDownTimeToPlacePixel) {
                _self.canvasManipulator.PlacePixelOnCanvas(event);
            }
            _self.mouseIsDown = false;
            _self.rightclickIsDown = false;
            _self.ChangeCanvasCursor();
        });
    }

    //change cursor for canvas events, no argument resets cursor 
    ChangeCanvasCursor(cursortype = null) {
        this.placeteam.canvas.style.cursor = cursortype;
    }

    RgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('');
    }

    DisableContextMenuEvent() {
        //disable context menu for right click;
        this.placeteam.canvas.addEventListener('contextmenu', (ev)=>{
            ev.preventDefault(); // this will prevent browser default behavior 
        });
    }
}