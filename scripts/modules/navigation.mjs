export class Navigation {
    placeteam = null;
    mouseState = null;

    constructor(placeteam, mouseState) {
        this.placeteam = placeteam;
        this.mouseState = mouseState;
    }

    SetEvents() {
        this.Pan();
    }

    Pan() {
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
}