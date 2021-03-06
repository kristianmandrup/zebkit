import EvStatePan from '../EvStatePan';
import { BorderLayout } from '../../layout';

export default class ToolPan extends EvStatePan {
    constructor(c) {
        super(new BorderLayout());
        this.add("center", c);
    }

    // static

    getContentComponent() {
        return this.kids[0];
    }

    stateUpdated(o, n) {
        super.stateUpdated(o, n);
        if (o === PRESSED_OVER && n === OVER) {
            this.parent._.fired(this);
        }
    }
}
