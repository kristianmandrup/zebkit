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
import ContentPan from './ContentPan';

export default class EditableContentPan extends ContentPan {
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