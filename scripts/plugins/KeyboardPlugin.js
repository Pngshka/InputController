'use strict';

import { BasePlugin } from "./BasePlugin.js";
import { InputController } from '../input-controller.js';
import { ActivWithKeyCode } from "./ActivWithKeyCode.js";


export class KeyboardPlugin extends BasePlugin {
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
        this._target.addEventListener('keydown', this.#lastEvent);
        this._target.addEventListener('keyup', this.#lastEvent);
    }

    detach() {
        if (!this._target) return;
        this._target.removeEventListener('keydown', this.#lastEvent);
        this._target.removeEventListener('keyup', this.#lastEvent);
        this.enable = false;
    }

    getActionEvent(e) {
        return e.type === 'keydown' ? InputController.ACTION_ACTIVATED : InputController.ACTION_DEACTIVATED;
    }

}