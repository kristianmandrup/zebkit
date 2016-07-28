import ScrollPan from '../ui/ScrollPan';

/**
 * Combo box list pad component class
 * @extends zebkit.ui.ScrollPan
 * @class  zebkit.ui.Combo.ComboPadPan
 */
 export default class ComboPadPan extends ScrollPan {
    $closeTime: number;
    adjustToComboSize: boolean;
    
    constructor() {
        super();
        this.$closeTime = 0;

        this.adjustToComboSize = true;
    }
    /**
     * A reference to combo that uses the list pad component
     * @attribute owner
     * @type {zebkit.ui.Combo}
     * @readOnly
     */
    childKeyPressed(e){
        if (e.code === pkg.KeyEvent.ESCAPE && this.parent != null){
            this.removeMe();
            if (this.owner != null) this.owner.requestFocus();
        }
    }

    setParent(l){
        super.setParent(l);
        if (l == null && this.owner != null) {
            this.owner.requestFocus();
        }

        this.$closeTime = l == null ? new Date().getTime() : 0;
    }
}