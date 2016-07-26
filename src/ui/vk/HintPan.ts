import Panel from '../core/Panel';

export default class HintPan extends Panel {
    get clazz() {
        this.Label = Class(ui.Label, []);
    }

    constructor() {
        super();
        this.add(new this.clazz.Label(""));
    }

    // static

    setValue(v) {
        this.kids[0].setValue(v);
    }
}
