'use strict';


export class BasePlugin {
    _inputController;
    _target;
    constructor(inputController, target) {
        this._inputController = inputController;
        if (target)
            this.attach(target);
    }

    //bindActions(actionsToBind) {}
    attach(target) { }
    detach() { }
}