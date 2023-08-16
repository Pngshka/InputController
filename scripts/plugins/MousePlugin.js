'use strict';

import { BasePlugin } from "./BasePlugin.js";
import { InputController } from '../input-controller.js';
import { ActivWithMouseCode } from "./ActivWithMouseCode.js";


export class MousePlugin extends BasePlugin {
    constructor(inputController, target, someObj) {
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
        this._target.addEventListener('onclick', this.#lastEvent);
        this._target.addEventListener('onclick', this.#lastEvent);
    }

    detach() {
        if (!this._target) return;
        this._target.removeEventListener('onclick', this.#lastEvent);
        this._target.removeEventListener('onclick', this.#lastEvent);
        this.enable = false;
    }

    getActionEvent(e) {
        return e.type === 'onclick' ? InputController.ACTION_ACTIVATED : InputController.ACTION_DEACTIVATED;
    }

    startAndEndEvent(e) {
        const ACTION = this.getActionEvent(e);

        if (e.repeat) return;
        if (this._inputController.enabled === false) return;

        const goodActives = Array.from(this._inputController.activites.values())
            .filter(x => x.enable && x instanceof ActivWithMouseCode && x.keys.includes(e.keyCode));


        for (let index in goodActives) {
            const goodActiv = goodActives[index];
            const activeButtons = Array.from(goodActiv.keys.values())
                .filter(x => this._inputController.isKeyPressed(x));

            //console.log(Array.from(goodActiv.keys.values()));
            if (activeButtons.length != 0 && ACTION === 'input-controller:action-activated') {
                return;
            }

            const eventName = InputController.ACTION;
            let event = new CustomEvent(eventName, {
                detail: { name: goodActiv.name }
            });
            this._target.dispatchEvent(event);
            if (ACTION === 'input-controller:action-activated') goodActiv.activeNow = e.keyCode;
            else if (goodActiv.activeNow != activeButtons) goodActiv.activeNow = 0;

            console.log(goodActiv.activeNow);
        }
    };
}