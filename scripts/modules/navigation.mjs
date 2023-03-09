export class Navigation {
    placeteam = null;
    mouseMovement = null;

    constructor(placeteam) {
        this.placeteam = placeteam;
    }

    SetEvents() {
        this.Pan();
    }

    Pan() {
        this.placeteam.canvas.addEventListener("mousemove", function(event) {
            if (mouseMovement.mouseIsDown) {
                const offsetX = event.movementX * -1;
                const offsetY = event.movementY * -1;
    
                this.placeteam.mapcontainer.scrollBy(offsetX, offsetY);
            }
            if(mouseMovement.rightclickIsDown){
                const mouseCoordinates = this.placeteam.getCoordinateslAtMouse(event);
                const rgbArray = this.placeteam.ctx.getImageData(mouseCoordinates.x, mouseCoordinates.y, 1, 1).data; 
                this.placeteam.changeColor("#"+this.placeteam.rgbToHex(rgbArray[0],rgbArray[1],rgbArray[2]),this.placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid);
            }
        });
    }
}