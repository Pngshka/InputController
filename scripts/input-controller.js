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

        if (this.activites.has(name)){
            this.activites.get(name).unionWithOtherActiv(Activnost.keys);
        } else this.activites.set(name, Activnost);

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

    detach() {
        this.#plugins.forEach(plugin => {
            plugin.detach();
        });
    }

}