'use strict';

export class Activ {
    name;
    enable;
    keys = [];
    activeNow = 0;

    constructor(name, enable, keys) {
        this.name = name;
        this.enable = enable;
        this.keys = keys;
    }

    isActiveNow() {
        return this.enable && this.activeNow != 0;
    }

    unionWithOtherActiv(keys) {
        this.keys.push(...keys);
    }

}

export class InputController {
    enabled;
    focused;
    static ACTION_ACTIVATED = 'input-controller:action-activated';
    static ACTION_DEACTIVATED = 'input-controller:action-deactivated';
    #target;
    #activites = new Map();
    #startEvent;
    #endEvent;


    constructor(someObj, target) {

        this.startAndEndEvent = this.startAndEndEvent.bind(this);

        const ACTION = "ACTION_ACTIVATED";
        //console.log(InputController[ACTION]);
        this.enabled = false;
        this.focused = document.hasFocus();
        if (someObj != null) {
            this.bindActions(someObj);
            this.attach(target);
        }
    }

    bindActions(actionsToBind) {
        for (const key in actionsToBind) {
            if (!actionsToBind.hasOwnProperty(key)) return
            if (this.#activites.has(key)) {

                this.#activites.get(key).unionWithOtherActiv(actionsToBind[key].keys);
            } else {

                let enabled = actionsToBind[key].enabled ?? true;
                let Activs = new Activ(key, enabled, actionsToBind[key].keys);
                this.#activites.set(key, Activs);
            }
        }
    }

    startAndEndEvent(e) {
        const ACTION = this.getActionEvent(e);

        if (e.repeat) return;
        if (this.enabled === false) return;

        console.log(this.#activites);
        const goodActives = Array.from(this.#activites.values())
            .filter(x => x.enable && x.keys.includes(e.keyCode));

        for (let index in goodActives) {
            const goodActiv = goodActives[index];
            const activeButtons = Array.from(goodActiv.keys.values())
                .filter(x => this.isKeyPressed(x));
            if (activeButtons.length != 0 && ACTION === 'input-controller:action-activated') {
                return;
            }

            const eventName = InputController.ACTION;
            let event = new CustomEvent(eventName, {
                detail: { name: goodActiv.name }
            });
            this.#target.dispatchEvent(event);
            if (ACTION === 'input-controller:action-activated') goodActiv.activeNow = e.keyCode;
            else if (goodActiv.activeNow != activeButtons) goodActiv.activeNow = 0;


        }
    };

    enableAction(actionName) {
        this.#activites.get(actionName).enable = true;

    }

    disableAction(actionName) {
        this.#activites.get(actionName).enable = false;
    }

    isActionActive(actionName) {
        const activ = this.#activites.get(actionName);

        this.focused = document.hasFocus();
        if (this.focused)
            return activ != null && activ.isActiveNow();
        else return false;
    }

    getActionEvent(e) {
        return e.type === 'keydown' ? InputController.ACTION_ACTIVATED : InputController.ACTION_DEACTIVATED;
    }

    attach(target, dontEnable) {
        this.detach();
        this.#target = target;
        this.#target.addEventListener('keydown', this.startAndEndEvent);
        this.#target.addEventListener('keyup', this.startAndEndEvent);
        if (!dontEnable)
            this.enabled = true;
    }

    detach() {
        if (!this.#target) return;
        this.#target.removeEventListener('keydown', this.startAndEndEvent);
        this.#target.removeEventListener('keyup', this.startAndEndEvent);
        this.enable = false;
    }

    isKeyPressed(keyCode) {
        const pressedKeys = {};
       
        function keyPressed(event) {
            console.log("keyPressed");
            pressedKeys[event.keyCode] = true;
        }

        function keyReleased(event) {
            console.log("keyReleased");
            delete pressedKeys[event.keyCode];
        }

        document.addEventListener("keydown", keyPressed);
        document.addEventListener("keyup", keyReleased);
        return pressedKeys[keyCode] === true;
    }

}