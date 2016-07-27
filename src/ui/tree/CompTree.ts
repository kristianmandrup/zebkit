import BaseTree from './BaseTree';

/**
 * Component tree component that expects other UI components to be a tree model values.
 * In general the implementation lays out passed via tree model UI components as tree
 * component nodes. For instance:

     var tree = new zebkit.ui.tree.Tree({
          value: new zebkit.ui.Label("Label root item"),
          kids : [
                new zebkit.ui.Checkbox("Checkbox Item"),
                new zebkit.ui.Button("Button item"),
                new zebkit.ui.Combo(["Combo item 1", "Combo item 2"])
         ]
     });

 * But to prevent unexpected navigation it is better to use number of predefined
 * with component tree UI components:

   - zebkit.ui.tree.CompTree.Label
   - zebkit.ui.tree.CompTree.Checkbox
   - zebkit.ui.tree.CompTree.Combo

 * You can describe tree model keeping in mind special notation

     var tree = new zebkit.ui.tree.Tree({
          value: "Label root item",  // zebkit.ui.tree.CompTree.Label
          kids : [
                "[ ] Checkbox Item 1", // unchecked zebkit.ui.tree.CompTree.Checkbox
                "[x] Checkbox Item 2", // checked zebkit.ui.tree.CompTree.Checkbox
                ["Combo item 1", "Combo item 2"] // zebkit.ui.tree.CompTree.Combo
         ]
     });

 *
 * @class  zebkit.ui.tree.CompTree
 * @constructor
 * @extends zebkit.ui.tree.BaseTree
 * @param {Object|zebkit.data.TreeModel} [model] a tree data model passed as JavaScript
 * structure or as an instance
 * @param {Boolean} [b] the tree component items toggle state. true to have all items
 * in opened state.
 */

import * as ui from '../';
import Panel from '../core/Panel';
import { Combo } from '../list';
import { types } from '../../utils';
import { Item, TreeModel } from '../../data';
import { KeyEvent } from '../web/keys'
import Font from '../web/Font';

class Label extends ui.Label {
    canHaveFocus: boolean;
    constructor() {
        super()
        this.canHaveFocus = true;
    }
}

class Checkbox extends ui.Checkbox {

}

class ComboX extends Combo {
    keyPressed(e) {
        if (e.code != KeyEvent.UP && e.code != KeyEvent.DOWN) {
            super.keyPressed(e);
        }
    }
}


export default class CompTree extends BaseTree {
    $clazz = {
        Label: Label,
        CheckBox: Checkbox, 
        Combo: ComboX,

        createModel: function(item, root, tree) {
            var mi = new Item();

            if (typeof item.value !== "undefined") {
                mi.value = item.value != null ? item.value : "";
            } else {
                mi.value = item;
            }

            mi.value = ui.$component(mi.value, tree);
            mi.parent = root;
            if (item.kids != null && item.kids.length > 0 && types.instanceOf(item, Panel) === false) {
                for (var i = 0; i < item.kids.length; i++) {
                    mi.kids[i] = this.createModel(item.kids[i], mi, tree);
                }
            }

            return mi;
        }
    }

    $blockCIE: boolean;
    canHaveFocus: boolean;
    isSelectable: boolean;
    font: any; // Font
    selected: any;

    constructor() {
        super();
        this.$blockCIE = false;
        this.canHaveFocus = false;
    }


    getItemPreferredSize(root) {
        return root.value.getPreferredSize();
    }

    childKeyTyped(e) {
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

    setFont(f) {
        this.font = types.isString(f) ? new Font(f) : f;
        return this;
    }

    childKeyPressed(e) {
        if (this.isSelectable === true){
            var newSelection = (e.code === KeyEvent.DOWN) ? this.findNext(this.selected)
                                                                : (e.code === KeyEvent.UP) ? this.findPrev(this.selected)
                                                                                            : null;
            if (newSelection != null) {
                this.select(newSelection);
            }
        }
    }
    
    childFocusGained(e?) {
        if (this.isSelectable === true && this.$blockCIE !== true) {
            this.$blockCIE = true;
            try {
                var item = TreeModel.findOne(this.model.root,
                                                        layout.getDirectChild(this,
                                                                                    e.source));

                console.log("childPointerPressed()  " + item);

                if (item != null) this.select(item);
            }
            finally {
                this.$blockCIE = false;
            }
        }
    }

    childPointerPressed() {
        this.childFocusGained();
    }

    childFocusLost(e) {
        if (this.isSelectable === true) {
            this.select(null);
        }
    }

    catchScrolled(psx, psy){
        this.vrp();
    }

    doLayout() {
        this.vVisibility();

        // hide all components
        for(var i = 0; i < this.kids.length; i++) {
            this.kids[i].setVisible(false);
        }

        if (this.firstVisible != null) {
            var $this = this, fvNode = this.getIM(this.firstVisible), started = 0;

            this.model.iterate(this.model.root, function(item) {
                var node = $this.nodes[item];  // slightly improve performance
                                                // (instead of calling $this.getIM(...))

                if (started === 0 && item === $this.firstVisible) {
                    started = 1;
                }

                if (started === 1) {
                    var sy = $this.scrollManager.getSY();

                    if (node.y + sy < $this.height) {
                        var image = $this.getIconBounds(item),
                            x = image.x + image.width +
                                        (image.width > 0 || $this.getToggleSize().width > 0 ? $this.gapx : 0) +
                                        $this.scrollManager.getSX(),
                            y = node.y + Math.floor((node.height - node.viewHeight) / 2) + sy;

                        item.value.setVisible(true);
                        item.value.setLocation(x, y);
                        item.value.width  = node.viewWidth;
                        item.value.height = node.viewHeight;
                    } else {
                        started = 2;
                    }
                }

                return (started === 2) ? 2 : (node.isOpen === false ? 1 : 0);
            });
        }
    }

    itemInserted(target, item) {
        this.add(item.value);
    }

    // static methods !?

    itemRemoved(target,item){
        super.itemRemoved(target,item);
        this.remove(item.value);
    }

    setModel(model) {
        var old = this.model;

        if (model != null && utils.instanceOf(model, data.TreeModel) === false) {
            model = new data.TreeModel(this.clazz.createModel(model, null, this));
        }

        super.setModel(model);

        if (old != this.model) {
            this.removeAll();
            if (this.model != null) {
                var $this = this;
                this.model.iterate(this.model.root, function(item) {
                    $this.add(item.value);
                });
            }
        }
        return this;
    }

    recalc() {
        // track with the flag a node metrics has been updated
        this.$isMetricUpdated  = false;
        super.recalc();

        // if a node size has been changed we have to force calling
        // repaint method for the whole tree component to render
        // tree lines properly
        if (this.$isMetricUpdated) {
            this.repaint();
        }
    }

    recalc_(x,y,parent,root,isVis) {
        // in a case of component tree node view size has to be synced with
        // component
        var node = this.getIM(root);
        if (isVis === true) {
            var viewSize = this.getItemPreferredSize(root);
            if (this.$isMetricUpdated === false && (node.viewWidth != viewSize.width  ||
                                                    node.viewHeight != viewSize.height  ))
            {
                this.$isMetricUpdated = true;
            }

            node.viewWidth  = viewSize.width;
            node.viewHeight = viewSize.height;
        }
        return super._recalc(x,y,parent,root,isVis);
    }

    select(item) {
        if (this.isSelectable === true) {
            var old = this.selected;

            if (old != null && old.value.hasFocus()) {
                ui.focusManager.requestFocus(null);
            }

            super.select(item);

            if (item != null) {
                item.value.requestFocus();
            }
        }
    }

    makeVisible(item) {
       item.value.setVisible(true);
       super.makeVisible(item);
    }
}
