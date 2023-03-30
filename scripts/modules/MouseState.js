export class MouseState {
    placeteam = null;
    canvasManipulator = null;

    mouseIsDown = false;
    rightclickIsDown = false;
    lastMouseDown = 0;

    constructor(placeteam) {
        this.placeteam = placeteam;
    }

    SetCanvasManipulator(canvasManipulator) {
        this.canvasManipulator = canvasManipulator;
    }

    SetEvents() {
        this.SetMouseDownEvent()
        this.SetMouseUpEvent();
        this.DisableContextMenuEvent();
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
                _self.mouseState.rightclickIsDown = true;
                _self.ChangeCanvasCursor('crosshair');
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

    DisableContextMenuEvent() {
        //disable context menu for right click;
        this.placeteam.canvas.addEventListener('contextmenu', (ev)=>{
            ev.preventDefault(); // this will prevent browser default behavior 
        });
    }
}