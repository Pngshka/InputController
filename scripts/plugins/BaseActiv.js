'use strict';

export class BaseActiv {
    name;
    enable;
    activeNow = 0;

    constructor(name, enable) {
        this.name = name;
        this.enable = enable;
    }

    isActiveNow() {
        return this.enable && !!this.activeNow;
    }

    unionWithOtherActiv(keys) { }

}