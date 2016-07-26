/**
 * Menu item panel class. The component holds menu item content like
 * caption, icon, sub-menu sign elements. The area of the component
 * is split into three parts: left, right and center. Central part
 * keeps content, left side keeps checked sign element
 * and the right side keeps sub-menu sign element.
 * @param  {String|zebkit.ui.Panel} caption a menu item caption string
 * or component. Caption string can encode the item id, item icon and
 * item checked state. For instance:

    - **"Menu Item [@menu_item_id]"** - triggers creation of menu item component
      with "Menu Item" caption and "menu_item_id" id property value
    - **"[x] Menu Item"** - triggers creation of checked menu item component
      with checked on state
    - **"@('mypicture.gif') Menu Item"** - triggers creation of menu item
       component with "Menu Item" caption and loaded mypicture.gif icon

        // create menu item with icon and "Item 1" title
        var mi = new zebkit.ui.MenuItem("@('mypicture.gif') Item 1");

 * @class zebkit.ui.MenuItem
 * @extends {zebkit.ui.Panel}
 * @constructor
 */
import Panel from '../../core/Panel';
import StatePan from '../../StatePan';
import Label from '../../Label';
import ViewPan from '../../core/ViewPan';
import { types } from '../../../utils';
import Group from '../../Group';
import SwitchManager from '../../SwitchManager';


function Clazz() {
    this.SubImage      = StatePan;
    this.Label         = Label;
    this.CheckStatePan = ViewPan;  
}

export default class MenuItem extends Panel {
    get clazz() {
        return new Clazz();
    }

    gap: number;
    manager: any;

    static Label = Label;

    constructor(c?) {
        super();
        /**
         * Gap between checked, content and sub menu arrow components
         * @attribute gap
         * @type {Integer}
         * @readOnly
         * @default 8
         */
        this.gap = 8;

        /**
         * Switch manager that is set to make the item checkable
         * @type {zebkit.ui.SwitchManager | zebkit.ui.Group}
         * @attribute manager
         * @readOnly
         */
        this.manager = null;

        this.add(new this.clazz.CheckStatePan());

        if (types.isString(c)) {
            var m = c.match(/(\s*\@\(.*\)\s*)?(\s*\[\s*\]|\s*\[\s*x\s*\]|\s*\(\s*x\s*\)|\s*\(\s*\))?\s*(.*)/);
            if (m == null) {
                throw new Error("Invalid menu item: " + c);
            }

            if (m[2] != null) {
                var s = m[2].trim();
                this.setCheckManager(s[0] === '(' ? new Group() : new SwitchManager());
                this.manager.setValue(this, m[2].indexOf('x') > 0);
            }

            var img = null;
            if (m[1] != null) {
                img = m[1].substring(m[1].indexOf("@(") + 2, m[1].lastIndexOf(")")).trim();
                if (img[0] === "'") {
                   img = img.substring(1, img.length-1);
                } else {
                    var parts = img.split('.'),
                        scope = zebkit.$global;

                    img = null;
                    for (var i = 0; i < parts.length; i++) {
                        scope = scope[parts[i]];
                        if (scope == null) break;
                    }
                    img = scope;
                }
            }

            c = m[3];
            m = c.match(/(.*)\s*\[\s*@([a-zA-Z_][a-zA-Z0-9_]+)\s*]\s*/);
            if (m != null) {
                this.id = m[2].trim();
                c       = m[1].trim();
            } else {
                this.id = c.toLowerCase().replace(/[ ]+/, '_');
            }

            c = new pkg.ImageLabel(new this.clazz.Label(c), img);
        } else {
            this.getCheck().setVisible(false);
        }

        this.add(c);
        this.add(new this.clazz.SubImage());

        this.setEnabled(c.isEnabled);
        this.setVisible(c.isVisible);
        
    }
    /**
     * Callback method that is called every time the menu item has
     * been selected.
     * @method  itemSelected
     */
    itemSelected() {
        var content = this.getContent();
        if (types.instanceOf(content, pkg.Checkbox)) {
            content.setValue(!content.getValue());
        }

        if (this.manager != null) {
            this.manager.setValue(this, !this.manager.getValue(this));
        }
    }

    /**
     * Set the menu item icon.
     * @param {String|Image} img a path to an image or image object
     * @method setIcon
     */
    setIcon(img) {
        this.getContent().setImage(img);
        return this;
    }

    /**
     * Set the menu item caption.
     * @param {String} caption a caption
     * @method setCaption
     */
    setCaption = function(caption) {
        this.getContent().setCaption(caption);
        return this;
    }

    /**
     * Callback method that is called every time a checked state
     * of the menu item has been updated
     * @param {Boolean} b a new checked state
     * @method switched
     * @protected
     */
    switched(b) {
        this.kids[0].view.activate(b ? (this.isEnabled === true ? "on" : "dis.on") : "off");
    }

    /**
     * Get check state component
     * @return {zebkit.ui.Panel} a check state component
     * @method getCheck
     * @protected
     */
    getCheck() {
        return this.kids[0];
    }

    /**
     * Get content component
     * @return {zebkit.ui.Panel} a content component
     * @method getContent
     * @protected
     */
    getContent() {
        return this.kids[1];
    }

    /**
     * Get menu item child component to render sub item arrow element
     * @return {zebkit.ui.Panel} a sub item arrow component
     * @method getSub
     * @protected
     */
    getSub() {
        return this.kids[2];
    }

    /**
     * Hide sub menu arrow component
     * @method hideSub
     */
    hideSub() {
        this.getSub().setVisible(false);
    }

    activateSub(b) {
        var kid = this.getSub();
        kid.setState(b ? "arrow" : "*");
        if (this.parent != null && this.parent.noSubIfEmpty === true) {
            kid.setVisible(b);
        }
    }

    calcPreferredSize(target){
        var cc = 0, pw = 0, ph = 0;

        for(var i=0; i < target.kids.length; i++) {
            var k = target.kids[i];
            if (k.isVisible === true) {
                var ps = k.getPreferredSize();
                pw += ps.width + (cc > 0 ? this.gap : 0);
                if (ps.height > ph) ph = ps.height;
                cc ++;
            }
        }

        return { width:pw, height:ph };
    }

    doLayout(target){
        var left    = this.getCheck(),
            right   = this.getSub(),
            content = this.getContent(),
            t       = target.getTop(),
            l       = target.getLeft(),
            eh      = target.height - t - target.getBottom(),
            ew      = target.width  - l - target.getRight();

        if (left != null && left.isVisible === true) {
            left.toPreferredSize();
            left.setLocation(l, t + Math.floor((eh - left.height)/2));
            l += this.gap + left.width;
            ew -= (this.gap + left.width);
        }

        if (right != null && right.isVisible === true) {
            right.toPreferredSize();
            right.setLocation(target.width - target.getRight() - right.width,
                              t + Math.floor((eh - right.height)/2));
            ew -= (this.gap + right.width);
        }

        if (content != null && content.isVisible === true) {
            content.toPreferredSize();
            if (content.width > ew) {
                content.setSize(ew, content.height);
            }
            content.setLocation(l, t + Math.floor((eh - content.height)/2));
        }
    }

    /**
     * Set the menu item checked state
     * @param {Boolean} b a checked state
     * @method setCheckState
     */
    setCheckState(b) {
        if (this.manager == null) {
            this.setCheckManager(new SwitchManager());
        }
        this.manager.setValue(this, b);
    }

    /**
     * Get menu item checked state
     * @return {Boolean} a menu item checked state
     * @method getCheckState
     */
    getCheckState() {
        return this.manager.getValue(this);
    }

    /**
     * Set the menu item checked state manager.
     * @param {zebkit.ui.SwitchManager|zebkit.ui.Group} man a switch manager
     * @method setCheckManager
     */
    setCheckManager(man) {
        if (this.manager != man) {
            if (this.manager != null) {
                this.manager.uninstall(this);
            }
            this.manager = man;
            this.manager.install(this);
        }
    }

    // static

    /**
     * Override setParent method to catch the moment when the
     * item is inserted to a menu
     * @param {zebkit.ui.Panel} p a parent
     * @method setParent
     */
    setParent(p) {
        super.setParent(p);
        if (p != null && p.noSubIfEmpty === true) {
            this.getSub().setVisible(false);
        }
    }

    setEnabled(b) {
        super.setEnabled(b);
        // sync menu item enabled state with checkable element state
        if (this.manager != null) {
            this.switched(this.manager.getValue(this));
        }
        return this;
    }
}