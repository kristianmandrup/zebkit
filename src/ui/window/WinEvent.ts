import { Event } from '../core/events'; 

export default class WinEvent extends Event {
    isShown: boolean;
    isActive: boolean;
    layer: any;
    source: any;

    constructor() {
        super();
        this.isShown = this.isActive = false;
        this.layer = null;
    }

    $fillWith(src, layer, isActive, isShown) {
        this.source = src;
        this.layer = layer;
        this.isActive = isActive;
        this.isShown = isShown;
        return this;
    }
}
