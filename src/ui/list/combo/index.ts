import Panel from '../../core/Panel';

export class ContentPan extends Panel {
    constructor() {
        super();
    }
    /**
     * Called whenever the given combo box value has been updated with the specified
     * value. Implement the method to synchronize content panel with updated combo
     * box value
     * @method comboValueUpdated
     * @param {zebkit.ui.Combo} combo a combo box component that has been updated
     * @param {Object} value a value with which the combo box has been updated
     */
    comboValueUpdated(combo, value) {
    }

    /**
     * Indicates if the content panel is editable. Set the property to true
     * to indicate the content panel implementation is editable. Editable
     * means the combo box content can be editable by a user
     * @attribute isEditable
     * @type {Boolean}
     * @readOnly
     * @default undefined
     */

    /**
     * Get a combo box the content panel belongs
     * @method getCombo
     * @return {zebkit.ui.Combo} a combo the content panel belongs
     */
    getCombo() {
        var p = this;
        while ((p = p.parent) && zebkit.instanceOf(p, pkg.Combo) === false);
        return p;
    }
}

import ScrollPan from '../ui/ScrollPan';

/**
 * Combo box list pad component class
 * @extends zebkit.ui.ScrollPan
 * @class  zebkit.ui.Combo.ComboPadPan
 */
 export class ComboPadPan extends ScrollPan {
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

/**
 * Read-only content area combo box component panel class
 * @extends zebkit.ui.Combo.ContentPan
 * @class  zebkit.ui.Combo.ReadonlyContentPan
 */
export class ReadonlyContentPan extends ContentPan {
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

/**
 * Editable content area combo box component panel class
 * @class zebkit.ui.Combo.EditableContentPan
 * @extends zebkit.ui.Combo.ContentPan
 */

/**
 * Fired when a content value has been updated.

content.bind(function(contentPan, newValue) {
    ...
});

    * @param {zebkit.ui.Combo.ContentPan} contentPan a content panel that
    * updated its value
    * @param {Object} newValue a new value the content panel has been set
    * with
    * @event  contentUpdated
    */

export class EditableContentPan extends ContentPan {
    $clazz = {
        TextField: TextField,
        Listeners: util.ListenersClass("contentUpdated")
    }

    canHaveFocus: boolean;
    dontGenerateUpdateEvent: boolean;
    isEditable: boolean;
    _: any;

    constructor() {
        super();
        this.canHaveFocus = true;

        this._ = new this.clazz.Listeners();

        this.isEditable = true;

        this.dontGenerateUpdateEvent = false;

        /**
         * A reference to a text field component the content panel uses as a
         * value editor
         * @attribute textField
         * @readOnly
         * @private
         * @type {zebkit.ui.TextField}
         */
        this.textField = new this.clazz.TextField("",  -1);
        this.textField.view.target.bind(this);
        this.add("center", this.textField);        
    }

    textUpdated(src,b,off,size,startLine,lines){
        if (this.dontGenerateUpdateEvent === false) {
            this._.contentUpdated(this, this.textField.getValue());
        }
    }

    /**
     * Called when the combo box content has been updated
     * @param {zebkit.ui.Combo} combo a combo where the new value has been set
     * @param {Object} v a new combo box value
     * @method comboValueUpdated
     */
    comboValueUpdated(combo, v){
        this.dontGenerateUpdateEvent = true;
        try {
            var txt = (v == null ? "" : v.toString());
            this.textField.setValue(txt);
            this.textField.select(0, txt.length);
        }
        finally {
            this.dontGenerateUpdateEvent = false;
        }
    }

    // static?

    focused() {
        super.focused();
        this.textField.requestFocus();
    }
}

import Button from '../ui/Button';

export class ButtonX extends Button {
    constructor() {
        super();
        this.setFireParams(true,  -1);
    }
}