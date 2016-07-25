import Panel from './Panel';
import StackLayout from './StackLayout';

export default class StackPan extends Panel {
    constructor() {
        super(new StackLayout());
        for(var i = 0; i < arguments.length; i++) {
            this.add(arguments[i]);
        }
    }
}
