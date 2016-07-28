import Panel from '../../core/Panel';

export default class ContentPan extends Panel {
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