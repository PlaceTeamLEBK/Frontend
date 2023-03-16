export class ColorChanger {
    placeteam = null;

    constructor(placeteam) {
        this.placeteam = placeteam;
    }

    SetEvents() {
        this.SetInputChangeEvents();
        this.SetClickEvents();
        this.SetEditModeButtonClickEvent();
    }

    SetInputChangeEvents() {
        let _self = this;
        this.placeteam.colorcontainer.querySelectorAll('.edit input').forEach((element, index) => {
            element.addEventListener('change', function(event){
                _self.placeteam.changeColor(element.value, element.dataset.colorid);
            });
        });
    }

    SetClickEvents() {
        let _self = this;
        this.placeteam.colorcontainer.querySelectorAll('.select>div').forEach((newselectelement) => {
            newselectelement.addEventListener('click', function(event){
                _self.placeteam.colorcontainer.querySelectorAll('.select>div').forEach((element)=>{
                    element.classList.remove('selected')
                })
                newselectelement.classList.add('selected');
            });
        });
    }

    SetEditModeButtonClickEvent() {
        let _self = this;
        this.placeteam.editcolorbutton.addEventListener('click', function(event){
            _self.placeteam.colorcontainer.querySelector('div.edit').classList.toggle('hidden');
            _self.placeteam.colorcontainer.querySelector('div.select').classList.toggle('hidden');
        });
    }
}