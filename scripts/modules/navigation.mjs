export class Navigation {
    placeteam = null;
    mouseState = null;

    constructor(placeteam, mouseState) {
        this.placeteam = placeteam;
        this.mouseState = mouseState;
    }

    SetEvents() {
        this.SetPanEvent();
        this.SetZoomEvent();
    }

    SetPanEvent() {
        let _self = this;
        this.placeteam.canvas.addEventListener("mousemove", function(event) {
            if (_self.mouseState.mouseIsDown) {
                const offsetX = event.movementX * -1;
                const offsetY = event.movementY * -1;
    
                _self.placeteam.mapcontainer.scrollBy(offsetX, offsetY);
            }
            if(_self.mouseState.rightclickIsDown){
                const mouseCoordinates = _self.placeteam.getCoordinateslAtMouse(event);
                const rgbArray = _self.placeteam.ctx.getImageData(mouseCoordinates.x, mouseCoordinates.y, 1, 1).data; 
                _self.placeteam.changeColor("#"+_self.placeteam.rgbToHex(rgbArray[0],rgbArray[1],rgbArray[2]),_self.placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid);
            }
        });
    }

    SetZoomEvent() {
        let _self = this;
        this.placeteam.canvas.addEventListener('wheel', function(event) {
            let minZoom = _self.placeteam.minZoomPercentageMobile;
            if (_self.placeteam.desktopMediaQuery.matches) {
                minZoom = _self.placeteam.minZoomPercentageDesktop;
            } else if (_self.placeteam.tabletMediaQuery.matches) {
                minZoom = _self.placeteam.minZoomPercentageTablet;
            }
    
            let newCanvasWidth;
            if (Math.sign(event.deltaY) < 0) {
                newCanvasWidth = _self.placeteam.getCanvasWidthPercentageInt() * _self.placeteam.zoomSpeed;
            } else {
                newCanvasWidth = _self.placeteam.getCanvasWidthPercentageInt() / _self.placeteam.zoomSpeed;
            }
            let normalizedCanvasWidth = Math.max(minZoom, newCanvasWidth);
            normalizedCanvasWidth = Math.min(_self.placeteam.maxZoom, normalizedCanvasWidth);
    
            placeteam.setZoom(normalizedCanvasWidth);
        });

        this.placeteam.mapcontainer.addEventListener('wheel', function(event) {
            event.preventDefault();
        });
    }
}