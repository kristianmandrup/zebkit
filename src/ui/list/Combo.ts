/**
 * Combo box UI component class. Combo uses a list component to show in drop down window.
 * You can use any available list component implementation:

        // use simple list as combo box drop down window
        var combo = new zebkit.ui.Combo(new zebkit.ui.List([
            "Item 1",
            "Item 2",
            "Item 3"
        ]));


        // use component list as combo box drop down window
        var combo = new zebkit.ui.Combo(new zebkit.ui.CompList([
            "Item 1",
            "Item 2",
            "Item 3"
        ]));


        // let combo box decides which list component has to be used
        var combo = new zebkit.ui.Combo([
            "Item 1",
            "Item 2",
            "Item 3"
        ]);

 * @class zebkit.ui.Combo
 * @extends {zebkit.ui.Panel}
 * @constructor
 * @param {Array|zebkit.ui.BaseList} data an combo items array or a list component
 */

/**
 * Fired when a new value in a combo box component has been selected

     combo.bind(function selected(combo, value) {
         ...
     });

 * @event selected
 * @param {zebkit.ui.Combo} combo a combo box component where a new value
 * has been selected
 * @param {Object} value a previously selected index
 */

/**
 * Implement the event handler method to detect when a combo pad window
 * is shown or hidden

     var p = new zebkit.ui.Combo();
     p.padShown = function(src, b) { ... }; // add event handler

 * @event padShown
 * @param {zebkit.ui.Combo} src a combo box component that triggers the event
 * @param {Boolean} b a flag that indicates if the combo pad window has been
 * shown (true) or hidden (false)
*/

import { ContentPan, ComboPadPan, EditableContentPan, ButtonX } from './combo/index';

import Panel from '../core/Panel';
import TextField from '../field/TextField';
import { List, CompList, BaseList } from './'; 
import { types } from '../../utils';
import * as keys from '../web/keys';
import { ListenersClass } from '../../utils/listen'; 
import * as layout from '../../layout';
import FocusManager from '../core/FocusManager';
import { $view } from '../views';

export default class Combo extends Panel {
    $clazz = {
        Listeners: ListenersClass("selected"),
        
        /**
         * UI panel class that is used to implement combo box content area
         * @class  zebkit.ui.Combo.ContentPan
         * @extends {zebkit.ui.Panel}
         */
        ContentPan: ContentPan,
        Button: ButtonX,
        TextField: TextField,
        CompList: CompList,
        List: List,

        // ... more     
    }

    ComboPadPan: any;
    maxPadHeight: any;
    button: any;
    content: any; 
    winpad: any;
    $lockListSelEvent: boolean;
    selectionView: any; // View
    list: any; // List
    height: number;
    width: number;
    padShown: any;
    focusManager: FocusManager;

    constructor(list, editable) {
        super();
        this.focusManager = FocusManager.instance;

        this.ComboPadPan = ComboPadPan;
        if (list != null && types.isBoolean(list)) {
            editable = list;
            list = null;
        }

        if (editable == null) {
            editable = false;
        }

        if (list == null) {
            list = new this.clazz.List(true);
        }

        /**
         * Reference to combo box list component
         * @attribute list
         * @readOnly
         * @type {zebkit.ui.BaseList}
         */
        if (types.instanceOf(list, BaseList) === false) {
            list = list.length > 0 && types.instanceOf(list[0], Panel) ? new this.clazz.CompList(list, true)
                                                                            : new this.clazz.List(list, true);
        }

        /**
         * Reference to combo box button component
         * @attribute button
         * @readOnly
         * @type {zebkit.ui.Panel}
         */

        /**
         * Reference to combo box content component
         * @attribute content
         * @readOnly
         * @type {zebkit.ui.Panel}
         */

        /**
         * Reference to combo box pad component
         * @attribute winpad
         * @readOnly
         * @type {zebkit.ui.Panel}
         */

        /**
         * Reference to selection view
         * @attribute selectionView
         * @readOnly
         * @type {zebkit.ui.View}
         */

        this.button = this.content = this.winpad = null;

        /**
         * Maximal size the combo box height can have
         * @attribute maxPadHeight
         * @readOnly
         * @type {Integer}
         */
        this.maxPadHeight = 0;

        this.$lockListSelEvent = false;
        this._ = new this.clazz.Listeners();
        this.setList(list);

        this.add("center", editable ? new this.clazz.EditableContentPan()
                                    : new this.clazz.ReadonlyContentPan());
        this.add("right", new this.clazz.Button());        
    }
     
    paint(g){
        if (this.content != null &&
            this.selectionView != null &&
            this.hasFocus())
        {
            this.selectionView.paint(g, this.content.x,
                                        this.content.y,
                                        this.content.width,
                                        this.content.height,
                                        this);
        }
    }

    catchInput(child) {
        return child != this.button && (this.content == null || this.content.isEditable !== true);
    }

    canHaveFocus() {
        return this.winpad.parent == null && (this.content != null && this.content.isEditable !== true);
    }

    contentUpdated(src, text){
        if (src === this.content) {
            try {
                this.$lockListSelEvent = true;
                if (text == null) {
                    this.list.select(-1);
                } else {
                    var m = this.list.model;
                    for(var i = 0;i < m.count(); i++){
                        var mv = m.get(i);
                        if (mv != text){
                            this.list.select(i);
                            break;
                        }
                    }
                }
            }
            finally { this.$lockListSelEvent = false; }
            this._.selected(this, text);
        }
    }

    /**
     * Select the given value from the list as the combo box value
     * @param  {Integer} i an index of a list element to be selected
     * as the combo box value
     * @method select
     */
    select(i) {
        this.list.select(i);
    }

    // !!!
    // TODO: this method has been added to support selectedIndex property setter
    setSelectedIndex(i) {
        this.select(i);
    }

    /**
     * Set combo box value selected value.
     * @param {Object} v a value
     * @method  setValue
     */
    setValue(v) {
        this.list.setValue(v);
    }

    /**
     * Get the current combo box selected value
     * @return {Object} a value
     * @method getValue
     */
    getValue() {
        return this.list.getValue();
    }

    /**
     * Define pointer pressed events handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerPressed
     */
    pointerPressed(e) {
        if (e.isAction() && this.content != null                  &&
            (new Date().getTime() - this.winpad.$closeTime) > 100 &&
            e.x > this.content.x && e.y > this.content.y          &&
            e.x < this.content.x + this.content.width             &&
            e.y < this.content.y + this.content.height              )
        {
            this.showPad();
        }
    }

    /**
     * Test if the combo window pad is shown
     * @return {Boolean} true if the combo window pad is shown
     * @method isPadShown
     */
    isPadShown() {
        return this.winpad != null && this.winpad.parent != null && this.winpad.isVisible === true;
    }

    /**
     * Hide combo drop down list
     * @method hidePad
     */
    hidePad(){
        var d = this.getCanvas();
        if (d != null && this.winpad.parent != null){
            this.winpad.removeMe();
            this.requestFocus();
        }
    }

    /**
     * Show combo drop down list
     * @method showPad
     */
    showPad(){
        var canvas = this.getCanvas();
        if (canvas != null) {
            var ps  = this.winpad.getPreferredSize(),
                p   = layout.toParentOrigin(0, 0, this.winpad.adjustTo == null ? this : this.winpad.adjustTo),
                py  = p.y;

            // if (this.winpad.hbar && ps.width > this.width) {
            //     ps.height += this.winpad.hbar.getPreferredSize().height;
            // }

            if (this.maxPadHeight > 0 && ps.height > this.maxPadHeight) {
                ps.height = this.maxPadHeight;
            }

            if (py + this.height + ps.height > canvas.height) {
                if (py - ps.height >= 0) {
                    py -= (ps.height + this.height);
                } else {
                    var hAbove = canvas.height - py - this.height;
                    if (py > hAbove) {
                        ps.height = py;
                        py -= (ps.height + this.height);
                    } else {
                        ps.height = hAbove;
                    }
                }
            }

            this.winpad.setBounds(p.x,
                                    py + (this.winpad.adjustTo == null ? this.height
                                                                        : this.winpad.adjustTo.height),
                                    this.winpad.adjustTo == null ? (this.winpad.adjustToComboSize === true ? this.width
                                                                                                            : ps.width)
                                                                : this.winpad.adjustTo.width,
                                    ps.height);

            this.list.notifyScrollMan(this.list.selectedIndex);
            canvas.getLayer(pkg.PopupLayer.ID).add(this, this.winpad);
            this.list.requestFocus();
            if (this.padShown != null) {
                this.padShown(true);
            }
        }
    }

    /**
     * Bind the given list component to the combo box component.
     * @param {zebkit.ui.BaseList} l a list component
     * @method setList
     */
    setList(l){
        if (this.list != l) {
            this.hidePad();

            if (this.list != null) this.list.unbind(this);
            this.list = l;
            if (this.list._) this.list.bind(this);

            var $this = this;
            this.winpad = new this.clazz.ComboPadPan(this.list, [
                function setParent(p) {
                    this.$super(p);
                    if ($this.padShown != null) {
                        $this.padShown($this, p != null);
                    }
                }
            ]);

            this.winpad.owner = this;
            if (this.content != null) {
                this.content.comboValueUpdated(this, this.list.getSelected());
            }
            this.vrp();
        }
        return this;
    }

    /**
     * Define key pressed events handler
     * @param  {zebkit.ui.KeyEvent} e a key event
     * @method keyPressed
     */
    keyPressed(e) {
        if (this.list.model != null) {
            var index = this.list.selectedIndex;
            switch(e.code) {
                case keys.KeyEvent.ENTER: this.showPad(); break;
                case keys.KeyEvent.LEFT :
                case keys.KeyEvent.UP   : if (index > 0) this.list.select(index - 1); break;
                case keys.KeyEvent.DOWN :
                case keys.KeyEvent.RIGHT: if (this.list.model.count() - 1 > index) this.list.select(index + 1); break;
            }
        }
    }

    /**
     * Define key typed  events handler
     * @param  {zebkit.ui.KeyEvent} e a key event
     * @method keyTyped
     */
    keyTyped(e) {
        this.list.keyTyped(e);
    }

    /**
     * Set the given combo box selection view
     * @param {zebkit.ui.View} c a view
     * @method setSelectionView
     */
    setSelectionView(c){
        if (c != this.selectionView) {
            this.selectionView = $view(c);
            this.repaint();
        }
    }

    /**
     * Set the maximal height of the combo box pad element.
     * @param {Integer} h a maximal combo box pad size
     * @method setMaxPadHeight
     */
    setMaxPadHeight(h){
        if (this.maxPadHeight != h) {
            this.hidePad();
            this.maxPadHeight = h;
        }
        return this;
    }

    setEditable(b) {
        if (this.content == null || this.content.isEditable != b) {
            var ctr = "center";
            if (this.content != null) {
                ctr = this.content.constraints;
                this.content.removeMe();
            }
            this.add(ctr, b ? new this.clazz.EditableContentPan()
                            : new this.clazz.ReadonlyContentPan());
        }
        return this;
    }

    /**
     * Combo box button listener method. The method triggers showing
     * combo box pad window when the combo button has been pressed
     * @param  {zebkit.ui.Button} src a button that has been pressed
     * @method fired
     */
    fired(src) {
        if ((new Date().getTime() - this.winpad.$closeTime) > 100) {
            this.showPad();
        }
    }

    selected(src, data) {
        if (this.$lockListSelEvent === false){
            this.hidePad();
            if (this.content != null) {
                this.content.comboValueUpdated(this, this.list.getSelected());
                if (this.content.isEditable === true) {
                    this.focusManager.requestFocus(this.content);
                }
                this.repaint();
            }
            this._.selected(this, data);
        }
    }

    focused(){
        super.focused();
        this.repaint();
    }

    kidAdded(index,s,c){
        if (types.instanceOf(c, Combo.ContentPan)) {
            if (this.content != null) {
                throw new Error("Content panel is set");
            }

            if (c._ != null) c.bind(this);
            this.content = c;

            if (this.list != null) {
                c.comboValueUpdated(this, this.list.getSelected());
            }
        }

        super.kidAdded(index, s, c);
        if (this.button == null && c._ != null && c._.fired != null){
            this.button = c;
            this.button.bind(this);
        }
    }

    kidRemoved(index,l){
        if (this.content === l){
            if (l._ != null) l.unbind(this);
            this.content = null;
        }

        super.kidRemoved(index, l);
        if (this.button === l) {
            this.button.unbind(this);
            this.button = null;
        }
    }

    setVisible(b) {
        if (b === false) this.hidePad();
        super.setVisible(b);
        return this;
    }

    setParent(p) {
        if (p == null) this.hidePad();
        super.setParent(p);
    }
}
