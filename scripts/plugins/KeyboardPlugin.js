'use strict';

import { BasePlugin } from "./BasePlugin.js";
import { InputController } from '../input-controller.js';


export class KeyboardPlugin extends BasePlugin {
    constructor(inputController, target) {
        super(inputController, target);
        if (target)
            this.startAndEndEvent = this.startAndEndEvent.bind(this);
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

    startAndEndEvent(e) {
        const ACTION = this.getActionEvent(e);

        if (e.repeat) return;
        if (this._inputController.enabled === false) return;

        console.log(this._inputController.activites);
        const goodActives = Array.from(this._inputController.activites.values())
            .filter(x => x.enable && x.keys.includes(e.keyCode));

        for (let index in goodActives) {
            const goodActiv = goodActives[index];
            const activeButtons = Array.from(goodActiv.keys.values());
               // .filter(x => this._inputController.isKeyPressed(x));
            // if (activeButtons.length != 0 && ACTION === 'input-controller:action-activated') {
            //     return;
            // }

            const eventName = InputController.ACTION;
            let event = new CustomEvent(eventName, {
                detail: { name: goodActiv.name }
            });
            this._target.dispatchEvent(event);
            if (ACTION === 'input-controller:action-activated') goodActiv.activeNow = e.keyCode;
            else if (goodActiv.activeNow != activeButtons) goodActiv.activeNow = 0;


        }
    };
}