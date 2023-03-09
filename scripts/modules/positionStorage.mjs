export class PositionStorage {
    placeteam = null;
    mouseState = null;
    navigation = null;

    constructor(placeteam, mouseState, navigation) {
        this.placeteam = placeteam;
        this.mouseState = mouseState;
        this.navigation = navigation;
    }

    SetPositionStorageUpdateTimer() {
        this.placeteam.getParameterTimer = setInterval(PositionStorageUpdate, this.placeteam.GetParameterUpdateInterval);
    }

    // Update GET position parameters if not clicking and local storage position values
    PositionStorageUpdate() {
        if (!this.mouseState.mouseIsDown && !this.mouseState.rightclickIsDown) {
            this.SetGetParameters();
        }
        this.SetPositionLocalStorage();
    }
    
    SetGetParameters() {
        const url = new URL(window.location.href);
        const currentCanvasWidth = this.placeteam.getCanvasWidthPercentageInt();

        const pixelSize = this.placeteam.getPixelSize();
        const pixelsToLeft = Math.floor(this.placeteam.mapcontainer.scrollLeft / pixelSize);
        const pixelsToTop = Math.floor(this.placeteam.mapcontainer.scrollTop / pixelSize);

        url.searchParams.set('x', pixelsToLeft);
        url.searchParams.set('y', pixelsToTop);
        url.searchParams.set('zoom', currentCanvasWidth);

        window.history.replaceState(null,"", url);
    }

    SetPositionLocalStorage() {
        const currentCanvasWidth = this.placeteam.getCanvasWidthPercentageInt();

        const pixelSize = this.placeteam.getPixelSize();
        const pixelsToLeft = Math.floor(this.placeteam.mapcontainer.scrollLeft / pixelSize);
        const pixelsToTop = Math.floor(this.placeteam.mapcontainer.scrollTop / pixelSize);
        
        localStorage.setItem("x", pixelsToLeft);
        localStorage.setItem("y", pixelsToTop);
        localStorage.setItem("zoom", currentCanvasWidth);
    }

    // Use GET parameters, or if there aren't any, load local storage
    LoadPositionStorage() {
        const urlSearchParams = new URLSearchParams(window.location.search);

        const urlZoom = urlSearchParams.get("zoom");
        const urlX = parseInt(urlSearchParams.get("x"));
        const urlY = parseInt(urlSearchParams.get("y"));

        if (urlZoom || urlX || urlY) {
            this.navigation.SetZoom(urlZoom);
            this.placeteam.offsetScrollToPixel(urlX, urlY);
        } else {
            const localZoom = localStorage.getItem("zoom");
            const localX = localStorage.getItem("x");
            const localY = localStorage.getItem("y");

            this.navigation.SetZoom(localZoom);
            this.placeteam.offsetScrollToPixel(localX, localY);
        }
    }
}