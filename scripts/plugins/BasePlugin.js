'use strict';


export class BasePlugin {
    _inputController;
    _target;
    constructor(inputController, target) {
        this._inputController = inputController;
        if (target)
            this.attach(target);
    }

    attach(target) { }
    detach() { }

    getActionEvent(e) {
        return e.type === 'mousedown' ? InputController.ACTION_ACTIVATED : InputController.ACTION_DEACTIVATED;
    }

    startAndEndEvent(e) {
        const ACTION = this.getActionEvent(e);

        if (e.repeat) return;
        if (this._inputController.enabled === false) return;

        const goodActives = Array.from(this._inputController.activites.values())
            .filter(x => x.enable && x.keys.includes(e.which));
            //.filter(x => x.enable && x instanceof ActivWithMouseCode && x.keys.includes(e.which));
            //console.log(goodActives);

        for (let index in goodActives) {
            const goodActiv = goodActives[index];
            const activeButtons = Array.from(goodActiv.keys.values())
                .filter(x => this._inputController.isKeyPressed(x));

            
            if (!!activeButtons.length && ACTION === 'input-controller:action-activated') {
                return;
            }

            const eventName = ACTION;
            let event = new CustomEvent(eventName, {
                detail: { name: goodActiv.name }
            });
            this._target.dispatchEvent(event);
            if (ACTION === 'input-controller:action-activated') goodActiv.activeNow = e.which;
            else if (goodActiv.activeNow != activeButtons) goodActiv.activeNow = 0;
            console.log(goodActiv.activeNow);
        }
    };
}