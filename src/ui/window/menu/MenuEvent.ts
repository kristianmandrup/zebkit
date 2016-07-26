import util from '../../utils';

export default class MenuEvent extends util.Event {
    index: number;
    item: any;
    source: any;

    constructor() {
        super();
        this.index = -1;
        this.item  = null;
    }

    $fillWith(src, index, item) {
        this.source = src;
        this.index = index;
        this.item = item;
        return this;
    }
}
