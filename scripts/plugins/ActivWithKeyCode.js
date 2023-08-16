
import { BaseActiv } from "./BaseActiv.js";

export class ActivWithKeyCode extends BaseActiv {
    keys = [];
    activeNow = 0;

    constructor(name, enable, keys) {
        super(name, enable);
        this.keys = keys;
    }

    unionWithOtherActiv(keys) {
        this.keys.push(...keys);
    }

}