/**
 * Read-only content area combo box component panel class
 * @extends zebkit.ui.Combo.ContentPan
 * @class  zebkit.ui.Combo.ReadonlyContentPan
 */
import ContentPan from './ContentPan';

export default class ReadonlyContentPan extends ContentPan {
    calcPsByContent: boolean;
    
    constructor() {
        super();
        this.calcPsByContent = false;
    }

    getCurrentView() {
        var list = this.getCombo().list,
            selected = list.getSelected();

        return selected != null ? list.provider.getView(list, selected, list.selectedIndex)
                                : null;
    }

    paintOnTop(g){
        var v = this.getCurrentView();
        if (v != null) {
            var ps = v.getPreferredSize();
            v.paint(g, this.getLeft(),
                        this.getTop() + Math.floor((this.height - this.getTop() - this.getBottom() - ps.height) / 2),
                        this.width, ps.height, this);
        }
    }

    setCalcPsByContent(b) {
        if (this.calcPsByContent != b) {
            this.calcPsByContent = b;
            this.vrp();
        }
    }

    calcPreferredSize(l) {
        var p = this.getCombo();
        if (p != null && this.calcPsByContent !== true) {
            return p.list.calcMaxItemSize();
        }
        var cv = this.getCurrentView();
        return cv == null ? { width: 0, height: 0} : cv.getPreferredSize();
    }

    comboValueUpdated(combo, value) {
        if (this.calcPsByContent === true) this.invalidate();
    }
}