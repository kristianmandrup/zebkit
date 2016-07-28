/**
 * Menu UI component class. The class implements popup menu UI component.

     var m = new Menu({
        "Menu Item 1" : [
            "[x] SubMenu Checked Item 1",
            "[ ] SubMenu Unchecked Item 2",
            "-",   // line
            "[ ] SubMenu Unchecked Item 3"
        ],
        "Menu Item 2" : null,
        "Menu Item 3" : null
     });

 *
 * @class zebkit.ui.Menu
 * @constructor
 * @param {Object} [list] use special notation to define a menu

        {
            'Menu Item 1': null,   // menu item 1 without a sub menu
            'Menu Item 2': null,   // menu item 2 without a sub menu
            '-':null,              // decorative line element
            'Menu Item 3': {       // menu item 3 with a sub menu defined
                "[x] Checkable menu item":null, // checkable menu item
                "Sub item 1":null
            }
        }

 * @extends {zebkit.ui.CompList}
 */

function Clazz() {
    var Label = this.Label = Class(pkg.MenuItem.Label,[]);

    this.MenuItem = Class(pkg.MenuItem, [
        function $clazz() {
            this.Label = Class(Label, []);
        }
    ]);

    this.Line = Class(pkg.Line, []);
    this.Line.prototype.$isDecorative = true;
}

import CompList from '../../list/CompList';
import { types } from '../../../utils'
import { MENU_EVENT } from './';

export default class Menu extends CompList {
    _clazz: Object;

    get clazz() {
      return this._clazz = this._clazz || new Clazz();
    }

    canHaveFocus: boolean;
    noSubIfEmpty: boolean;

    decoratives: any;
    menus: any;
    kids: any[];

    height: number;

    constructor(d?) {
        super([], types.isBoolean(d) ? d : true);
        this.canHaveFocus = true;
        this.noSubIfEmpty = false;

        this.menus = {};

        /**
         * Dictionary to keep decorative components
         * @attribute decoratives
         * @type {Object}

           {
               {zebkit.ui.Panel}:true
           }

         * @readOnly
         * @private
         */
        this.decoratives = {};

        if (Array.isArray(d)) {
            for(var i = 0; i < d.length; i++) {
                this.add(d[i]);
            }
        } else {
            for(var k in d) {
                if (d.hasOwnProperty(k)) {
                    var sub = d[k];
                    this.add(k);
                    if (sub != null) {
                        this.setMenuAt(this.kids.length-1, zebkit.instanceOf(sub, pkg.Menu) ? sub : new pkg.Menu(sub));
                    }
                }
            }
        }        
    }

    /**
     * Test if the given menu item is a decorative (not selectable) menu item.
     * Menu item is considered as decorative if it has been added with addDecorative(...)
     * method or has "$isDecorative" property set to "true"
     * @param  {Integer}  i a menu item index
     * @return {Boolean}  true if the given menu item is decorative
     * @method isDecorative
     */
    isDecorative(i){
        return this.decoratives[this.kids[i]] === true ||
                this.kids[i].$isDecorative === true;
    }

    /**
     * Define component events handler.
     * @param  {zebkit.ui.CompEvent} e  a component event
     * @method  childCompEnabled
     */
    childCompEnabled(e) {
        var src = e.source;
        for(var i = 0;i < this.kids.length; i++){
            if (this.kids[i] == src) {
                // clear selection if an item becomes not selectable
                if (this.isItemSelectable(i) === false) {
                    if (i == this.selectedIndex) this.select(-1);
                }
                break;
            }
        }
    };

    childCompShown(e) {
      this.childCompEnabled(e);
    }

    /**
     * Get a menu item by the given index
     * @param  {Integer} i a menu item index
     * @return {zebkit.ui.Panel} a menu item component
     * @method getMenuItem
     */
    getMenuItem(i) {
        if (types.isString(i)) {
            var item = this.find(i);
            if (item != null) return item;
            for (var k in this.menus) {
                item = this.menus[k].getMenuItem(i);
                if (item != null) return item;
            }
        }
        return this.kids[i];
    }

    /**
     * Test if the menu has a selectable item
     * @return {Boolean} true if the menu has at least one selectable item
     * @method hasSelectableItems
     */
    hasSelectableItems(){
        for(var i = 0;i < this.kids.length; i++) {
            if (this.isItemSelectable(i)) return true;
        }
        return false;
    }

    /**
     * Define pointer exited events handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerExited
     */
    pointerExited(e){
        this.position.setOffset(null);
    }

    /**
     * Get a sub menu for the given menu item
     * @param  {Integer} index a menu item index
     * @return {zebkit.ui.Menu} a sub menu or null if no sub menu
     * is defined for the given menu item
     * @method getMenuAt
     */
    getMenuAt(index){
        return this.menus[this.kids[index]];
    }

    /**
     * Set the given menu as a sub-menu for the specified menu item
     * @param {Integer} i an index of a menu item for that a sub menu
     * has to be attached
     * @param {zebkit.ui.Menu} m a sub menu to be attached
     * @method setMenuAt
     */
    setMenuAt(i, m){
        if (m == this) {
            throw new Error("Menu cannot be sub-menu of its own");
        }

        if (this.isDecorative(i)) {
            throw new Error("Decorative element cannot have a sub-menu");
        }

        var p = this.kids[i];
        if (p.activateSub != null) {
            var sub = this.menus[p];
            if (m != null) {
                if (sub == null) {
                    p.activateSub(true);
                }
            } else {
                if (sub != null) p.activateSub(false);
            }
        }

        // if the menu is shown and the menu item is selected
        if (this.parent != null && i === this.selectedIndex) {
            this.select(-1);
        }

        this.menus[p] = m;
        return this;
    }

    /**
     * Get the specified sub-menu index
     * @param  {zebkit.ui.Menu} menu a sub menu
     * @return {Integer} a sub menu index. -1 if the menu is
     * not a sub menu of the given menu
     * @method indexMenuOf
     */
    indexMenuOf(menu) {
        for(var i = 0; i < this.kids.length; i++) {
            if (this.menus[this.kids[i]] == menu) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Called when the menu or a sub-menu has been canceled (key ESCAPE has been pressed).
     * @param  {zebkit.ui.Menu} m a menu (or sub menu) that has been canceled
     * @method $canceled
     * @protected
     */
    $canceled(m) {
        if (this.$parentMenu != null && this.$canceled != null) {
            this.$parentMenu.$canceled(m);
        }
    }

    /**
     * Get the top menu in the given shown popup menu hierarchy
     * @return {zebkit.ui.Menu} a top menu
     * @method $topMenu
     * @protected
     */
    $topMenu() {
        if (this.parent != null) {
            var t = this;

            while ((p = t.$parentMenu) != null) t = p;
            return t;
        }
        return null;
    }

    doScroll(dx, dy, source) {
        var sy = this.scrollManager.getSY(),
            ps = this.layout.calcPreferredSize(this),
            eh = this.height - this.getTop() - this.getBottom();

        if (this.height < ps.height && sy + ps.height >= eh && sy - dy <= 0) {
            var nsy = sy - dy;
            if (nsy + ps.height < eh) {
                nsy = eh - ps.height;
            }
            if (sy != nsy) this.scrollManager.scrollYTo(nsy);
        }
    }

    /**
     * Hide the menu and all visible sub-menus
     * @param {zebkit.ui.Menu} triggeredBy a menu that has triggered the hiding of
     * menu hierarchy
     * @method $hideMenu
     * @protected
     */
    $hideMenu(triggeredBy) {
        if (this.parent != null) {
            var ch = this.$childMenu();
            if (ch != null) {
                ch.$hideMenu(triggeredBy);
            }

            this.removeMe();
        }
    }

    /**
     * Get a sub menu that is shown at the given moment.
     * @return {zebkit.ui.Menu} a child sub menu. null if no child sub-menu
     * has been shown
     * @method $childMenu
     * @protected
     */
    $childMenu() {
        if (this.parent != null) {
            for(var k in this.menus) {
                var m = this.menus[k];
                if (m.$parentMenu == this) {
                    return m;
                }
            }
        }
        return null;
    }

    /**
     * Show the given sub menu
     * @param  {zebkit.ui.Menu} sub a sub menu to be shown
     * @method $showSubMenu
     * @protected
     */
    $showSubMenu(sub) {
        sub.setLocation(this.x + this.width - 10,
                        this.y + this.kids[this.selectedIndex].y);
        sub.toPreferredSize();
        this.parent.add(sub);
        sub.requestFocus();
    }

    triggerSelectionByPos(i) {
        return this.getMenuAt(i) != null && this.$triggeredByPointer;
    }

    // static

    /**
     * Override key pressed events handler to handle key events according to
     * context menu component requirements
     * @param  {zebkit.ui.KeyEvent} e a key event
     * @method keyPressed
     */
    keyPressed(e){
        if (e.code === pkg.KeyEvent.ESCAPE) {
            if (this.parent != null) {
                var p = this.$parentMenu;
                this.$canceled(this);
                this.$hideMenu(this);
                if (p != null) p.requestFocus();
            }
        } else {
            this.$super(e);
        }
    }

    insert(i, ctr, c) {
        if (zebkit.isString(c)) {
            return this.$super(i, ctr, (c.match(/^\-+$/) != null) ? new this.clazz.Line()
                                                                  : new this.clazz.MenuItem(c));
        }
        return this.$super(i, ctr, c);
    }

    setParent(p) {
        if (p != null) {
            this.select(-1);
            this.position.setOffset(null);
        } else {
            this.$parentMenu = null;
        }
        this.$super(p);
    }

    /**
     * Add the specified component as a decorative item of the menu
     * @param {zebkit.ui.Panel} c an UI component
     * @method addDecorative
     */
    addDecorative(c) {
        this.decoratives[c] = true;
        this.$getSuper("insert").call(this, this.kids.length, null, c);
    }

    kidRemoved(i,c) {
        if (this.decoratives[c] !== true) {
            delete this.decoratives[c];
        }
        this.setMenuAt(i, null);
        this.$super(i, c);
    }

    isItemSelectable(i) {
        return this.$super(i) && this.isDecorative(i) === false;
    }

    posChanged(target,prevOffset,prevLine,prevCol) {
        var off = target.offset;

        if (off >= 0) {
            var rs = null;

            // hide previously shown sub menu if position has been re-newed
            if (this.selectedIndex >= 0  && off != this.selectedIndex) {
                var sub = this.getMenuAt(this.selectedIndex);
                if (sub != null) {
                    sub.$hideMenu(this);
                    rs = -1; // request to clear selection
                }
            }

            // request fire selection if the menu is shown and position has moved to new place
            if (this.parent != null && off != this.selectedIndex && this.isItemSelectable(off)) {
                if (this.triggerSelectionByPos(off)) rs = off;
            }

            if (rs !== null) {
                this.select(rs);
            }
        }

        this.$super(target, prevOffset, prevLine, prevCol);
    }

    fireSelected(prev) {
        if (this.parent != null && this.selectedIndex >= 0) {
            var sub = this.getMenuAt(this.selectedIndex);

            if (sub != null) {
                if (sub.parent != null) {
                    // hide menu since it has been already shown
                    sub.$hideMenu(this);
                } else {
                    // show menu
                    sub.$parentMenu = this;
                    this.$showSubMenu(sub);
                }
            } else {

                console.log("fireSelected() ... ");

                var k = this.kids[this.selectedIndex];
                if (k.itemSelected != null) {
                    k.itemSelected();
                }

                // an atomic menu, what means a menu item has been selected
                // remove this menu an all parents menus
                var top = this.$topMenu();
                if (top != null) {
                    top.$hideMenu(this);
                }
            }

            pkg.events.fireEvent("menuItemSelected",
                                 MENU_EVENT.$fillWith(this, this.selectedIndex, this.kids[this.selectedIndex]));
        }
        super.fireSelected(prev);
    }
}