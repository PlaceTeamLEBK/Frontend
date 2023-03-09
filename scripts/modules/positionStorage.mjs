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
        let _self = this;
        this.placeteam.getParameterTimer = setInterval(function(){_self.PositionStorageUpdate(_self)}, this.placeteam.getParameterUpdateInterval);
    }

    // Update GET position parameters if not clicking and local storage position values
    PositionStorageUpdate(_self) {
        if (!_self.mouseState.mouseIsDown && !_self.mouseState.rightclickIsDown) {
            _self.SetGetParameters(_self);
        }
        _self.SetPositionLocalStorage(_self);
    }
    
    SetGetParameters(_self) {
        const url = new URL(window.location.href);
        const currentCanvasWidth = _self.placeteam.getCanvasWidthPercentageInt();

        const pixelSize = _self.placeteam.getPixelSize();
        const pixelsToLeft = Math.floor(_self.placeteam.mapcontainer.scrollLeft / pixelSize);
        const pixelsToTop = Math.floor(_self.placeteam.mapcontainer.scrollTop / pixelSize);

        url.searchParams.set('x', pixelsToLeft);
        url.searchParams.set('y', pixelsToTop);
        url.searchParams.set('zoom', currentCanvasWidth);

        window.history.replaceState(null,"", url);
    }

    SetPositionLocalStorage(_self) {
        const currentCanvasWidth = _self.placeteam.getCanvasWidthPercentageInt();

        const pixelSize = _self.placeteam.getPixelSize();
        const pixelsToLeft = Math.floor(_self.placeteam.mapcontainer.scrollLeft / pixelSize);
        const pixelsToTop = Math.floor(_self.placeteam.mapcontainer.scrollTop / pixelSize);
        
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