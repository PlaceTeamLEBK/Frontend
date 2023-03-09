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
        let navObject = this;
        this.placeteam.canvas.addEventListener("mousemove", function(event) {
            if (navObject.mouseState.mouseIsDown) {
                const offsetX = event.movementX * -1;
                const offsetY = event.movementY * -1;
    
                navObject.placeteam.mapcontainer.scrollBy(offsetX, offsetY);
            }
            if(navObject.mouseState.rightclickIsDown){
                const mouseCoordinates = navObject.placeteam.getCoordinateslAtMouse(event);
                const rgbArray = navObject.placeteam.ctx.getImageData(mouseCoordinates.x, mouseCoordinates.y, 1, 1).data; 
                navObject.placeteam.changeColor("#"+navObject.placeteam.rgbToHex(rgbArray[0],rgbArray[1],rgbArray[2]),navObject.placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid);
            }
        });
    }

    SetZoomEvent() {
        let navObject = this;
        this.placeteam.canvas.addEventListener('wheel', function(event) {
            let minZoom = navObject.placeteam.minZoomPercentageMobile;
            if (desktopMediaQuery.matches) {
                minZoom = navObject.placeteam.minZoomPercentageDesktop;
            } else if (tabletMediaQuery.matches) {
                minZoom = navObject.placeteam.minZoomPercentageTablet;
            }
    
            let newCanvasWidth;
            if (Math.sign(event.deltaY) < 0) {
                newCanvasWidth = navObject.placeteam.getCanvasWidthPercentageInt() * navObject.placeteam.zoomSpeed;
            } else {
                newCanvasWidth = navObject.placeteam.getCanvasWidthPercentageInt() / navObject.placeteam.zoomSpeed;
            }
            let normalizedCanvasWidth = Math.max(minZoom, newCanvasWidth);
            normalizedCanvasWidth = Math.min(navObject.placeteam.maxZoom, normalizedCanvasWidth);
    
            placeteam.setZoom(normalizedCanvasWidth);
        });

        this.placeteam.mapcontainer.addEventListener('wheel', function(event) {
            event.preventDefault();
        });
    }
}