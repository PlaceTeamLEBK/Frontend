import { Navigation } from "./modules/Navigation.js";
import { MouseState } from "./modules/MouseState.js";
import { PositionStorage } from "./modules/PositionStorage.js";
import { CanvasManipulator } from "./modules/CanvasManipulator.js";
import { ColorChanger } from "./modules/ColorChanger.js";
import { ZoomSlider } from "./modules/ZoomSlider.js";
import { ColorStorage } from "./modules/ColorStorage.js";
import { PlaceteamWebSocket } from "./modules/PlaceteamWebSocket.js";
import { Intro } from "./modules/Intro.js";

window.addEventListener("load", (event) => {
    const placeteam = {};

    placeteam.zoomSpeed = 1.02;
    placeteam.maximumClickDownTimeToPlacePixel = 125;

    placeteam.minZoomPercentageMobile = 270;
    placeteam.minZoomPercentageTablet = 150;
    placeteam.minZoomPercentageDesktop = 100;
    placeteam.maxZoom = 1000;
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
        placeteam.cooldown = seconds;
        if(seconds>0){
            placeteam.status.classList.remove('hidden');
        }
    }
    const colorStorage = new ColorStorage(placeteam);

    const colorChanger = new ColorChanger(placeteam, colorStorage);
    colorChanger.SetEvents();

    const mouseState = new MouseState(placeteam,colorChanger);

    const placeteamWebSocket = new PlaceteamWebSocket(placeteam);

    const canvasManipulator = new CanvasManipulator(placeteam, mouseState, placeteamWebSocket);

    mouseState.SetCanvasManipulator(canvasManipulator);
    mouseState.SetEvents();

    placeteamWebSocket.SetCanvasManipulator(canvasManipulator);
    placeteamWebSocket.Init();

    const navigation = new Navigation(placeteam, mouseState, canvasManipulator, colorChanger);
    navigation.SetEvents();

    const zoomSlider = new ZoomSlider(placeteam, navigation, canvasManipulator);
    zoomSlider.SetEvents();

    const positionStorage = new PositionStorage(placeteam, mouseState, navigation, canvasManipulator);

    const Intro = new Intro(placeteam);
    Intro.startIntro();

    colorStorage.LoadColors();
    positionStorage.LoadPositionStorage();
    positionStorage.SetPositionStorageUpdateTimer();
});