export class Navigation {
    placeteam = null;
    mouseState = null;
    canvasManipulator = null;
    colorChanger = null;

    constructor(placeteam, mouseState, canvasManipulator, colorChanger) {
        this.placeteam = placeteam;
        this.mouseState = mouseState;
        this.canvasManipulator = canvasManipulator;
        this.colorChanger = colorChanger;
    }

    SetEvents() {
        this.SetPanEvent();
        this.SetMousewheelEvent();
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
                _self.colorChanger.ChangeColor("#"+_self.RgbToHex(rgbArray[0],rgbArray[1],rgbArray[2]), _self.placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid);
            }
        });
    }

    SetMousewheelEvent() {
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
                newCanvasWidth = _self.canvasManipulator.GetCanvasWidthPercentageInt() * _self.placeteam.zoomSpeed;
            } else {
                newCanvasWidth = _self.canvasManipulator.GetCanvasWidthPercentageInt() / _self.placeteam.zoomSpeed;
            }
            let normalizedCanvasWidth = Math.max(minZoom, newCanvasWidth);
            normalizedCanvasWidth = Math.min(_self.placeteam.maxZoom, normalizedCanvasWidth);
    
            _self.SetZoom(normalizedCanvasWidth);
        });

        this.placeteam.mapcontainer.addEventListener('wheel', function(event) {
            event.preventDefault();
        });
    }

    SetZoom(newCanvasWidth) {
        let _self = this;
        if (parseInt(newCanvasWidth)) {
            _self.placeteam.rangezoom.value = newCanvasWidth;
            const initialWidth = _self.placeteam.canvas.clientWidth;
    
            _self.placeteam.canvas.style.cssText = 'width: ' + newCanvasWidth + '%;';
    
            const newWidth = _self.placeteam.canvas.clientWidth;
            const halfWidthDifference = newWidth - initialWidth;
            const widthPositionFraction = (_self.placeteam.mapcontainer.scrollLeft + window.innerWidth / 2) / _self.placeteam.canvas.clientWidth;
            const heightPositionFraction =  (_self.placeteam.mapcontainer.scrollTop + window.innerHeight / 2) / _self.placeteam.canvas.clientHeight;
            _self.placeteam.mapcontainer.scrollBy(halfWidthDifference * widthPositionFraction, halfWidthDifference * heightPositionFraction);    
        }
    }

    OffsetScrollToPixel = (x, y) => {
        const pixelSize = this.canvasManipulator.GetPixelSize();
        this.placeteam.mapcontainer.scrollTo(Math.ceil(pixelSize * x), Math.ceil(pixelSize * y));
    }
    
    RgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }
}