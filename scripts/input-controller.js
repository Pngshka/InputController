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
    get focused() {
        return this.#target ? this.#target.hasFocus():false;
    }
    static ACTION_ACTIVATED = 'input-controller:action-activated';
    static ACTION_DEACTIVATED = 'input-controller:action-deactivated';
    #target;
    activites = new Map();
    #plugins = [];


    constructor(someObj, target) {
        this.enabled = false;
        if (someObj != null) {
            this.bindActions(someObj);
            this.attach(target);
        }
    }

    bindActions(actionsToBind) {
        for (const key in actionsToBind) {
            if (!actionsToBind.hasOwnProperty(key)) return
            if (this.activites.has(key)) {
                this.activites.get(key).unionWithOtherActiv(actionsToBind[key].keys);
            } else {
                let enabled = actionsToBind[key].enabled ?? true;
                let Activs = new Activ(key, enabled, actionsToBind[key].keys);
                this.activites.set(key, Activs);
            }
        }
    }

    enableAction(actionName) {
        this.activites.get(actionName).enable = true;
    }

    disableAction(actionName) {
        this.activites.get(actionName).enable = false;
    }

    isActionActive(actionName) {
        const activ = this.activites.get(actionName);

        if (this.focused)
            return activ != null && activ.isActiveNow();
        else return false;
    }

    

    attach(target, dontEnable) {
        this.#plugins.forEach(plugin => {
            plugin.attach(target);
        });
        this.#target = target;
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

    addPlugin(plugin) {
        this.#plugins.push(plugin);
    }

    removePlugin(plugin) {
        let index = this.#plugins.indexOf(plugin);
        if (index !== -1)
            this.#plugins.splice(index, 1);
    }



}