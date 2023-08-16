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
                .filter(x => this.isKeyPressed(x));

            
            if (!!activeButtons.length && ACTION === 'input-controller:action-activated') {
                return;
            }

            const eventName = ACTION;
            let event = new CustomEvent(eventName, {
                detail: { name: goodActiv.name }
            });
            this._target.dispatchEvent(event);
            if (ACTION=='input-controller:action-activated') goodActiv.activeNow++;
                else goodActiv.activeNow--;

            console.log(goodActiv.activeNow);
        }
    }

    isKeyPressed(keyCode) {
        const pressedKeys = {};
        let flag = false;

        function keyPressed(event) {
            pressedKeys[event.keyCode] = true;
        }

        function keyReleased(event) {
            delete pressedKeys[event.keyCode];
        }

        document.addEventListener("mousedown", keyPressed);
        document.addEventListener("mouseup", keyReleased);

        return pressedKeys[keyCode] === true;
    }
    
}