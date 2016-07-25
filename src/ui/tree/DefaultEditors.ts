import data from '../data';
import ui from '../ui';
/**
 * Default tree editor provider
 * @class zebkit.ui.tree.DefEditors
 */
export default class DefEditors {
    tf: any;

    constructor() {
        // super();

        /**
         * Internal component that are designed as default editor component
         * @private
         * @readOnly
         * @attribute tf
         * @type {zebkit.ui.TextField}
         */
        this.tf = new ui.TextField(new data.SingleLineTxt(""));
        this.tf.setBackground("white");
        this.tf.setBorder(null);
        this.tf.setPadding(0);
    }        

    /**
     * Get an UI component to edit the given tree model element
     * @param  {zebkit.ui.tree.Tree} src a tree component
     * @param  {zebkit.data.Item} item an data model item
     * @return {zebkit.ui.Panel} an editor UI component
     * @method getEditor
     */
    getEditor(src,item){
        var o = item.value;
        this.tf.setValue((o == null) ? "" : o.toString());
        return this.tf;
    }

    /**
     * Fetch a model item from the given UI editor component
     * @param  {zebkit.ui.tree.Tree} src a tree UI component
     * @param  {zebkit.ui.Panel} editor an editor that has been used to edit the tree model element
     * @return {Object} an new tree model element value fetched from the given UI editor component
     * @method fetchEditedValue
     */
    fetchEditedValue(src, editor){
        return editor.view.target.getValue();
    }

    /**
     * The method is called to ask if the given input event should trigger an tree component item
     * @param  {zebkit.ui.tree.Tree} src a tree UI component
     * @param  {zebkit.ui.PointerEvent|zebkit.ui.KeyEvent} e   an input event: pointer or key event
     * @return {Boolean} true if the event should trigger edition of a tree component item
     * @method @shouldStartEdit
     */
    shouldStartEdit(src,e){
        return  e.id === "pointerDoubleClicked" ||
                (e.id === "keyPressed" && e.code === ui.KeyEvent.ENTER);
    }
}
