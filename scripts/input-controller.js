'use strict';


export class InputController {
    enabled;
    static ACTION_ACTIVATED = 'input-controller:action-activated';
    static ACTION_DEACTIVATED = 'input-controller:action-deactivated';
    #target;
    activites = new Map();
    #plugins = [];


    constructor(target) {
        this.enabled = false;
        this.attach(target);

    }

    bindActions(Activnost) {
        const name = Activnost.name;
        this.activites.set(name, Activnost);

    }

    enableAction(actionName) {
        this.activites.get(actionName).enable = true;
    }

    disableAction(actionName) {
        this.activites.get(actionName).enable = false;
    }

    isActionActive(actionName) {
        const activ = this.activites.get(actionName);

        return activ != null && activ.isActiveNow();
    }

    attach(target, dontEnable) {
        this.#plugins.forEach(plugin => {
            plugin.attach(target);
        });
        this.#target = target;
        if (!dontEnable)
            this.enabled = true;
    }

    addPlugin(plugin) {
        this.#plugins.push(plugin);
    }

    removePlugin(plugin) {
        let index = this.#plugins.indexOf(plugin);
        if (index !== -1)
            this.#plugins.splice(index, 1);
    }

    /*detach() {
        if (!this.#target) return;
        this.#target.removeEventListener('keydown', this.startAndEndEvent);
        this.#target.removeEventListener('keyup', this.startAndEndEvent);
        this.enable = false;
    }*/

    isKeyPressed(keyCode) {
        const pressedKeys = {};

        function keyPressed(event) {
            //console.log("keyPressed");
            pressedKeys[event.keyCode] = true;
        }

        function keyReleased(event) {
            //console.log("keyReleased");
            delete pressedKeys[event.keyCode];
        }

        function keyPressedMouse(event) {
            //console.log("keyReleased");
            if (pressedKeys[event.which]) {
                delete pressedKeys[event.which];
                return false;
            }
            pressedKeys[event.which] = true;
            return true;
        }


        document.addEventListener("keydown", keyPressed);
        document.addEventListener("keyup", keyReleased);
        document.addEventListener("click", keyPressedMouse);
        //document.addEventListener("keyup", keyReleased);
        return pressedKeys[keyCode] === true;
    }
}