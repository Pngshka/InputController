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
    isKeyPressed(keyCode) { }
}