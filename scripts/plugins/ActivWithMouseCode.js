
import { BaseActiv } from "./BaseActiv.js";

export class ActivWithMouseCode extends BaseActiv {
    keys = [];
    activeNow = 0;

    constructor(name, enable, keys) {
        super(name, enable);
        this.keys = keys;
    }

    isActiveNow() {
        return this.enable && this.activeNow != 0;
    }

    unionWithOtherActiv(keys) {
        this.keys.push(...keys);
    }

}