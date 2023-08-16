'use strict';

import { BasePlugin } from "./BasePlugin.js";
import { InputController } from '../input-controller.js';
import { ActivWithMouseCode } from "./ActivWithMouseCode.js";


export class MousePlugin extends BasePlugin {
    constructor(inputController, target) {
        super(inputController, target);
        if (target) {
            this.startAndEndEvent = this.startAndEndEvent.bind(this);
        }
    }

    #lastEvent;
    attach(target) {
        this.detach();
        this._target = target;
        this.#lastEvent = this.startAndEndEvent.bind(this);
        this._target.addEventListener('mousedown', this.#lastEvent);
        this._target.addEventListener('mouseup', this.#lastEvent);
    }

    detach() {
        if (!this._target) return;
        this._target.removeEventListener('mousedown', this.#lastEvent);
        this._target.removeEventListener('mouseup', this.#lastEvent);
        this.enable = false;
    }

    getActionEvent(e) {
        return e.type === 'mousedown' ? InputController.ACTION_ACTIVATED : InputController.ACTION_DEACTIVATED;
    }

    
}