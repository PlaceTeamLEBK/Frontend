export class Navigation {
    mouseMovement = null;

    constructor(mouseMovement) {
        this.mouseMovement = mouseMovement;
    }

    Pan(canvas, mapcontainer, context, placeteam) {
        canvas.addEventListener("mousemove", function(event) {
            if (mouseMovement.mouseIsDown) {
                const offsetX = event.movementX * -1;
                const offsetY = event.movementY * -1;
    
                mapcontainer.scrollBy(offsetX, offsetY);
            }
            if(mouseMovement.rightclickIsDown){
                const mouseCoordinates = placeteam.getCoordinateslAtMouse(event);
                const rgbArray = context.getImageData(mouseCoordinates.x, mouseCoordinates.y, 1, 1).data; 
                placeteam.changeColor("#"+placeteam.rgbToHex(rgbArray[0],rgbArray[1],rgbArray[2]),placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid);
            }
        });
    }
}