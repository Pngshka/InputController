'use strict';

class Activ {
    name;
    enable;
    keys;
    activeNow = 0;

    constructor(name, enable, keys) {
        this.name = name;
        this.enable = enable;
        this.keys = Array.from(keys);
        console.log(name, enable, keys);
    }

    isActiveNow() {
        return this.enable && this.activeNow != 0;
    }
}

class InputController {
    enabled;
    focused;    //todo такое же должно быть у target
    static ACTION_ACTIVATED = 'actionactivated';
    static ACTION_DEACTIVATED = 'actiondeactivated';
    #target;
    #activites = [];
    #event;

    constructor(someObj, target) {
        this.enabled = false;
        this.focused = true;
        if (someObj != null) {
            this.#target = target;
            this.bindActions(someObj);
        }
    }

     bindActions(actionsToBind) {//Не дублировать сущности при добавлении новых
        for (var key in actionsToBind) {
            if (actionsToBind.hasOwnProperty(key)) {
                let enabled = actionsToBind.enabled === false ? false : true;
                let Activs = new Activ(key, enabled, actionsToBind[key].keys);
                this.#activites.push(Activs);
            }
        }
    }

    enableAction(actionName) {
        this.#activites
            .filter((x) => (x.name = actionName))
            .forEach((x) => (x.enable = true));


    }

    disableAction(actionName) {
        this.#activites
            .filter((x) => (x.name = actionName))
            .forEach((x) => (x.enable = false));
    }

     isActionActive(actionName) {
        const activ = this.#activites.filter(
            (x) => (x.name = actionName)
        )[0];
        return activ.isActiveNow();
     }

    attach() {}
    detach() {
        if (target == null) return;
            this.#target.removeEventListener(this.#event);
            this.enable = false;
        }

    isKeyPressed() {

    }

}

let someObj = {
    right: {
        keys: [39, 68]
    },
    left: {
        keys: [37, 65]
    }
};


let inputController = new InputController(someObj);