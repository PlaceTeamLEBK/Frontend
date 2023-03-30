import { Navigation } from "./modules/Navigation.js";
import { MouseState } from "./modules/MouseState.js";
import { PositionStorage } from "./modules/PositionStorage.js";
import { CanvasManipulator } from "./modules/CanvasManipulator.js";
import { ColorChanger } from "./modules/ColorChanger.js";
import { ZoomSlider } from "./modules/ZoomSlider.js";
import { ColorStorage } from "./modules/ColorStorage.js";
import { PlaceteamWebSocket } from "./modules/PlaceteamWebSocket.js";

window.addEventListener("load", (event) => {
    const placeteam = {};

    placeteam.zoomSpeed = 1.02;
    const maximumClickDownTimeToPlacePixel = 125;

    const mouseState = new MouseState();

    placeteam.minZoomPercentageMobile = 270;
    placeteam.minZoomPercentageTablet = 150;
    placeteam.minZoomPercentageDesktop = 100;
    placeteam.maxZoom = 400;
    placeteam.getParameterUpdateInterval = 1000;

    placeteam.tabletMediaQuery = window.matchMedia("(min-width: 756px)");
    placeteam.desktopMediaQuery = window.matchMedia("(min-width: 992px)");

    placeteam.mapcontainer = document.querySelector('.mapcontainer');
    placeteam.canvas = document.getElementById("pixelcanvas");
    placeteam.ctx = document.getElementById("pixelcanvas").getContext("2d",{ willReadFrequently: true });
    placeteam.colorcontainer = document.getElementById("colorcontainer");
    placeteam.status = document.getElementById("statuscontainer");
    placeteam.editcolorbutton = document.getElementById("editcolorbutton");
    placeteam.cooldownelement = placeteam.status.querySelector('.cooldown');
    placeteam.cooldown = null; //in seconds
    placeteam.colors = ['#000000','#ffffff','#fff100','#ff8c00','#e81123','#009e49','#00188f','#68217a','#00bcf2','#bad80a'];
    placeteam.ctx.imageSmoothingEnabled = false;
    placeteam.fullscreen = false;
    placeteam.rangezoom = document.getElementById("range_zoom");
    

    placeteam.getCoordinateslAtMouse = (event)=> {
        const rect = placeteam.canvas.getBoundingClientRect()
        const x = Math.floor(Math.max(Math.min(((event.clientX - rect.left) /  placeteam.canvas.clientWidth) *  placeteam.canvas.width,  placeteam.canvas.width - 1), 0));
        const y = Math.floor(Math.max(Math.min(((event.clientY - rect.top)  /  placeteam.canvas.clientWidth) *  placeteam.canvas.height,  placeteam.canvas.height - 1), 0));
        return {x:x,y:y};
    };

    placeteam.canvas.addEventListener('mousedown', function(event) {

        if(event.which == 1){//left click
            mouseState.lastMouseDown = Date.now();   
            mouseState.mouseIsDown = true;
            placeteam.changeCanvasCursor('grab');
        }
        else if (event.which == 3){//right click   
            mouseState.rightclickIsDown = true;
           placeteam.changeCanvasCursor('crosshair');
        }
    });

    placeteam.canvas.addEventListener('mouseup', function(event) {
        if (Date.now() - mouseState.lastMouseDown < maximumClickDownTimeToPlacePixel) {
            canvasManipulator.PlacePixelOnCanvas(event);
        }
        mouseState.mouseIsDown = false;
        mouseState.rightclickIsDown = false;
        placeteam.changeCanvasCursor();
    });

    placeteam.rgbToHex = (r, g, b) => {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }
    //disable context menu for right click;
    placeteam.canvas.addEventListener('contextmenu', (ev)=>{
        ev.preventDefault(); // this will prevent browser default behavior 
      });
    //change cursor for canvas events, no argument resets cursor 
    placeteam.changeCanvasCursor = (cursortype=null) => {
        placeteam.canvas.style.cursor = cursortype;
    };
    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement===null) {
         placeteam.fullscreen=false;
        } else {
         placeteam.fullscreen=true;
        }
    });
    placeteam.setTimer = (cooldown) => {  
        var seconds = cooldown;
        clearInterval(placeteam.timerinterval);
        placeteam.timerinterval = setInterval(Cooldownminus, 1000);
        function Cooldownminus() {
            --seconds;
            placeteam.cooldownelement.innerHTML = seconds;
            placeteam.cooldown = seconds;
            if(seconds < 1){
                clearInterval(placeteam.timerinterval);
                placeteam.status.classList.add('hidden');
            }
        }   
        if(seconds>0){
            placeteam.status.classList.remove('hidden');
        }
    }

    const placeteamWebSocket = new PlaceteamWebSocket(placeteam);
    placeteamWebSocket.Init();

    const canvasManipulator = new CanvasManipulator(placeteam, mouseState, placeteamWebSocket);
    placeteamWebSocket.SetCanvasManipulator(canvasManipulator);


    const colorStorage = new ColorStorage(placeteam);

    const colorChanger = new ColorChanger(placeteam, colorStorage);
    colorChanger.SetEvents();

    const navigation = new Navigation(placeteam, mouseState, canvasManipulator, colorChanger);
    navigation.SetEvents();

    const zoomSlider = new ZoomSlider(placeteam, navigation, canvasManipulator);
    zoomSlider.SetEvents();

    const positionStorage = new PositionStorage(placeteam, mouseState, navigation, canvasManipulator);

    colorStorage.LoadColors();
    positionStorage.LoadPositionStorage();
    positionStorage.SetPositionStorageUpdateTimer();
});