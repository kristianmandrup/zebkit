/**
 * Tree UI component that visualizes a tree data model. The model itself can be passed as JavaScript
 * structure or as a instance of zebkit.data.TreeModel. Internally tree component keeps the model always
 * as zebkit.data.TreeModel class instance:

     var tree = new zebkit.ui.tree.Tree({
          value: "Root",
          kids : [  "Item 1", "Item 2"]
     });

 * or

     var model = new zebkit.data.TreeModel("Root");
     model.add(model.root, "Item 1");
     model.add(model.root, "Item 2");

     var tree = new zebkit.ui.tree.Tree(model);

 * Tree model rendering is fully customizable by defining an own views provider. Default views
 * provider renders tree model item as text. The tree node can be made editable by defining an
 * editor provider. By default tree modes are not editable.
 * @class  zebkit.ui.tree.Tree
 * @constructor
 * @extends zebkit.ui.tree.BaseTree
 * @param {Object|zebkit.data.TreeModel} [model] a tree data model passed as JavaScript
 * structure or as an instance
 * @param {Boolean} [b] the tree component items toggle state. true to have all items
 * in opened state.
 */
import SingleLineText from '../../data/SingleLineText';
import BaseTree from './BaseTree';
import KeyEvent from '../web/keys/KeyEvent';
import TextField from '../field/TextField'
import DefViews from './DefaultViews'

export default class Tree extends BaseTree {
    itemGapY: number;
    itemGapX: number;

    provider: any; 
    editedItem: any; 
    pressedItem: any;
    editors: any;

    constructor(d, b){
        super(d, b);

        this.itemGapY = 2;
        this.itemGapX = 4;

        if (arguments.length < 2) {
            b  = true;
        }

        this.provider = this.editedItem = this.pressedItem = null;

        /**
         * A tree model items view provider
         * @readOnly
         * @attribute provider
         * @default an instance of zebkit.ui.tree.DefsViews
         * @type {zebkit.ui.tree.DefsViews}
         */

        /**
         * A tree model editor provider
         * @readOnly
         * @attribute editors
         * @default null
         * @type {zebkit.ui.tree.DefEditors}
         */

        this.editors = null;
        this.setViewProvider(new DefViews());                
    }

    setFont(f) {
        this.provider.setFont(f);
        this.vrp();
        return this;
    };

    childKeyPressed(e){
        if (e.code === KeyEvent.ESCAPE) {
            this.stopEditing(false);
        } else {
            if (e.code === KeyEvent.ENTER &&
                    ((types.instanceOf(e.source, TextField) === false) ||
                    (types.instanceOf(e.source.view.target, SingleLineText))))
            {
                this.stopEditing(true);
            }
        }
    }

    catchScrolled(psx, psy){
        if (this.kids.length > 0) this.stopEditing(false);

        if (this.firstVisible == null) {
            this.firstVisible = this.model.root;
        }
        this.firstVisible = (this.y < psy) ? this.nextVisible(this.firstVisible)
                                            : this.prevVisible(this.firstVisible);
        this.repaint();
    }

    laidout() {
        this.vVisibility();
    }

    getItemPreferredSize(root) {
        var ps = this.provider.getView(this, root).getPreferredSize();
        ps.width  += this.itemGapX * 2;
        ps.height += this.itemGapY * 2;
        return ps;
    };

    paintItem(g, root, node, x, y) {
        if (root != this.editedItem){
            var v = this.provider.getView(this, root);
            v.paint(g, x + this.itemGapX, y + this.itemGapY,
                    node.viewWidth, node.viewHeight, this);
        }
    }

    /**
     * Initiate the given item editing if the specified event matches condition
     * @param  {zebkit.data.Item} item an item to be edited
     * @param  {zebkit.util.Event} e an even that may trigger the item editing
     * @return {Boolean}  return true if an item editing process has been started,
     * false otherwise
     * @method  se
     * @private
     */
    se(item, e){
        if (item != null){
            this.stopEditing(true);
            if (this.editors != null && this.editors.shouldStartEdit(item, e)) {
                this.startEditing(item);
                return true;
            }
        }
        return false;
    }

    pointerClicked(e){
        if (this.se(this.pressedItem, e)) {
            this.pressedItem = null;
        }
    };

    pointerDoubleClicked(e) {
        if (this.se(this.pressedItem, e)) {
            this.pressedItem = null;
        } else {
            if (this.selected != null &&
                this.getItemAt(this.firstVisible, e.x, e.y) === this.selected)
            {
                this.toggle(this.selected);
            }
        }
    }

    pointerReleased(e){
        if (this.se(this.pressedItem, e)) this.pressedItem = null;
    }

    keyTyped(e){
        if (this.selected != null){
            switch(e.ch) {
                case '+': if (this.isOpen(this.selected) === false) {
                    this.toggle(this.selected);
                } break;
                case '-': if (this.isOpen(this.selected)) {
                    this.toggle(this.selected);
                } break;
            }
        }
    }

    keyPressed(e){
        var newSelection = null;
        switch(e.code) {
            case ui.KeyEvent.DOWN    :
            case ui.KeyEvent.RIGHT   : newSelection = this.findNext(this.selected);break;
            case ui.KeyEvent.UP      :
            case ui.KeyEvent.LEFT    : newSelection = this.findPrev(this.selected);break;
            case ui.KeyEvent.HOME    : if (e.ctrlKey) this.select(this.model.root);break;
            case ui.KeyEvent.END     : if (e.ctrlKey) this.select(this.findLast(this.model.root));break;
            case ui.KeyEvent.PAGEDOWN: if (this.selected != null) this.select(this.nextPage(this.selected, 1));break;
            case ui.KeyEvent.PAGEUP  : if (this.selected != null) this.select(this.nextPage(this.selected,  -1));break;
            //!!!!case ui.KeyEvent.ENTER: if(this.selected != null) this.toggle(this.selected);break;
        }
        if (newSelection != null) this.select(newSelection);
        this.se(this.selected, e);
    }

    /**
     * Start editing the given if an editor for the item has been defined.
     * @param  {zebkit.data.Item} item an item whose content has to be edited
     * @method startEditing
     * @protected
     */
    startEditing(item){
        this.stopEditing(true);
        if (this.editors != null){
            var editor = this.editors.getEditor(this, item);
            if (editor != null) {
                this.editedItem = item;
                var b  = this.getItemBounds(this.editedItem),
                    ps = editor.getPreferredSize();

                editor.setBounds(b.x + this.scrollManager.getSX() + this.itemGapX,
                                    b.y - Math.floor((ps.height - b.height + 2 * this.itemGapY) / 2) +
                                    this.scrollManager.getSY() + this.itemGapY,
                                    ps.width, ps.height);

                this.add(editor);
                ui.focusManager.requestFocus(editor);
                this._.editingStarted(this, item, editor);
            }
        }
    }

    /**
     * Stop editing currently edited tree item and apply or discard the result of the
     * editing to tree data model.
     * @param  {Boolean} true if the editing result has to be applied to tree data model
     * @method stopEditing
     * @protected
     */
    stopEditing(applyData){
        if (this.editors != null && this.editedItem != null) {
            var item     = this.editedItem,
                oldValue = item.value,
                editor   = this.kids[0];

            try {
                if (applyData)  {
                    this.model.setValue(this.editedItem,
                                        this.editors.fetchEditedValue(this.editedItem, this.kids[0]));
                }
            }
            finally {
                this.editedItem = null;
                this.removeAt(0);
                this.requestFocus();
                this._.editingStopped(this, item, oldValue, editor, applyData);
            }
        }
    }

    toggle(item) {
        this.stopEditing(false);
        super.toggle(item);
    }

    itemInserted(target,item){
        this.stopEditing(false);
        super.itemInserted(target,item);
    }

    itemRemoved(target,item){
        this.stopEditing(false);
        super.itemRemoved(target,item);
    }

    /**
     * Set the given editor provider. The editor provider is a class that is used to decide which UI
     * component has to be used as an item editor, how the editing should be triggered and how the
     * edited value has to be fetched from an UI editor.
     * @param {zebkit.ui.tree.DefEditors} p an editor provider
     * @method setEditorProvider
     */
    setEditorProvider(p){
        if (p != this.editors){
            this.stopEditing(false);
            this.editors = p;
        }
        return this;
    }

    /**
     * Set tree component items view provider. Provider says how tree model items
     * have to be visualized.
     * @param {zebkit.ui.tree.DefViews} p a view provider
     * @method setViewProvider
     */
    setViewProvider(p){
        if (this.provider != p) {
            this.stopEditing(false);
            this.provider = p;
            delete this.nodes;
            this.nodes = {};
            this.vrp();
        }
        return this;
    }

    /**
     * Set the given tree model to be visualized with the UI component.
     * @param {zebkit.data.TreeModel|Object} d a tree model
     * @method setModel
     */
    setModel(d){
        this.stopEditing(false);
        super.setModel(d);
        return this;
    }

    paintSelectedItem(g, root, node, x, y) {
        if (root != this.editedItem) {
            super.paintSelectedItem(g, root, node, x, y);
        }
    }

    itemPressed(root, e) {
        super.itemPressed(root, e);
        if (this.se(root, e) === false) this.pressedItem = root;
    }

    pointerPressed(e){
        this.pressedItem = null;
        this.stopEditing(true);
        super.pointerPressed(e);
    }
}
