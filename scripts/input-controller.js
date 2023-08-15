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
    #activites = [];
    #startEvent;
    #endEvent;

    constructor(someObj, target) {
        this.enabled = false;
        this.focused = document.hasFocus();
        if (someObj != null) {
            this.bindActions(someObj);
            this.attach(target);
        }
        //console.log(this.focused);
    }

    bindActions(actionsToBind) {
        //console.log(actionsToBind);
       // console.log(actionsToBind.length);
       for (const key in actionsToBind) {
            //console.log(key);
            //console.log(this.#activites);
            if (actionsToBind.hasOwnProperty(key) == false) return

            //console.log(this.#activites.filter((x) => (x.name == key)).length);
            if (this.#activites.filter((x) => (x.name == key)).length!=0) {
                
                this.#activites.filter(
                    (x) => (x.name == key)
                )[0].unionWithOtherActiv([1, 2, 3]);
            } else {

            let enabled = actionsToBind[key].enabled === false ? false : true;
            let Activs = new Activ(key, enabled, actionsToBind[key].keys);
            this.#activites.push(Activs);
            }
        }
    }

    enableAction(actionName) {
        this.#activites
            .filter((x) => (x.name == actionName))
            .forEach((x) => (x.enable = true));
    }

    disableAction(actionName) {
        this.#activites
            .filter((x) => (x.name == actionName))
            .forEach((x) => (x.enable = false));
    }

    isActionActive(actionName) {
        const activ = this.#activites.filter(
            (x) => (x.name == actionName)
        )[0];

        this.focused = document.hasFocus();
        if (this.focused)
            return activ != null && activ.isActiveNow();
        else return false;
    }

    attach(target, dontEnable) {
        this.detach();
        this.#target = target;
        this.#startEvent = ((e) => this.startAndEndEvent(InputController.ACTION_ACTIVATED, e)).bind(this);

        this.#endEvent = ((e) => this.startAndEndEvent(InputController.ACTION_DEACTIVATED, e)).bind(this);
        this.#target.addEventListener('keydown', this.#startEvent);
        this.#target.addEventListener('keyup', this.#endEvent);
        if (dontEnable == null || dontEnable == false)
            this.enabled = true;
    }

    detach() {
        if (this.#target == null) return;
        this.#target.removeEventListener('keydown', this.#startEvent);
        this.#target.removeEventListener('keyup', this.#endEvent);
        this.enable = false;
    }

    isKeyPressed(keyCode) {
        const goodActives = this.#activites
            .filter((x) => (x.keys.includes(keyCode) && x.activeNow != 0));

        return goodActives.length != 0;
    }

    startAndEndEvent(ACTION, e) {
        if (e.repeat) return;
        if (this.enabled == false) return;
        const goodActives = this.#activites.filter(
            (x) => x.enable && x.keys.includes(e.keyCode)
        );
        for (let index in goodActives) {
            const goodActiv = goodActives[index];
            const eventName = InputController.ACTION;
            let event = new CustomEvent(eventName, {
                detail: { name: goodActiv.name }
            });
            this.#target.dispatchEvent(event);
            if (ACTION == 'input-controller:action-activated') goodActiv.activeNow++;
            else goodActiv.activeNow--;

        }
    }
}