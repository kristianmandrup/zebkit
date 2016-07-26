import Window from './Window';
import HtmlCanvas from '../core/HtmlCanvas';

import BorderLayout from '../../layout/BorderLayout';

export default class HtmlWinCanvas extends HtmlCanvas {
    target: any;

    constructor(target?) {
        super(target);

        this.target = (target == null ? new Window() : target);

        target.getWinContainer = () => {
            return this;
        };

        this.setLayout(new BorderLayout());
        this.add("center", target);
    }

    winOpened(e) {
        this.target.winOpened(e);
    };

    winActivated(e){
        this.target.winActivated(e);
    }
}
