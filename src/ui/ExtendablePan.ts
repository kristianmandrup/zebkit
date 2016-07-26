/**
 * Extendable  UI panel class. Implement collapsible panel where
 * a user can hide of show content by pressing special control
 * element:

        // create extendable panel that contains list as its content
        var ext = zebkit.ui.ExtendablePan("Title", new zebkit.ui.List([
            "Item 1",
            "Item 2",
            "Item 3"
        ]));


 * @constructor
 * @class zebkit.ui.ExtendablePan
 * @extends {zebkit.ui.Panel}
 * @param {zebkit.ui.Panel|String} l a title label text or
 * @param {zebkit.ui.Panel} c a content of the extender panel
 * component
 */

 /**
  * Fired when extender is collapsed or extended

         var ex = new zebkit.ui.ExtendablePan("Title", pan);
         ex.bind(function (src, isCollapsed) {
             ...
         });

  * @event fired
  * @param {zebkit.ui.ExtendablePan} src an extender UI component that generates the event
  * @param {Boolean} isCollapsed a state of the extender UI component
  */

import StatePan from './StatePan';

class TogglePan extends StatePan {
    constructor() {
        super();
        this.cursorType = pkg.Cursor.HAND;
    }

    pointerPressed(e){
        if (e.isAction()) {
            // TODO: not very nice ref
            this.parent.parent.toggle();
        }
    }
}

import Group from './Group';

class GroupX extends Group {
    constructor(target) {
        super(true);
        this.target = target;        
    }

    // static

    setValue(o, v) {
        var selected = this.selected;
        super.setValue(o, v);

        if (v === false && selected != null && this.selected === null) {
            var i = this.target.indexOf(selected);
            i = (i + 1) % this.target.kids.length;
            if (this.target.kids[i] !== selected) {
                this.setValue(this.target.kids[i], true);
            }
        }
        return this;
    }
}

import Panel from './core/Panel';

class GroupPan extends Panel {
    get clazz() {
        return {
            Group: GroupX
        };
    }

    constructor() {
        super();
        this.group = new this.clazz.Group(this);
        this.$super();
        for(var i = 0; i < arguments.length; i++) {
            arguments[i].setSwitchManager(this.group);
            this.add(arguments[i]);
        }        
    }

    doLayout(t) {
        var y     = t.getTop(),
            x     = t.getLeft(),
            w     = t.width - x - t.getRight(),
            eh    = t.height - y - t.getBottom();

        // setup sizes for not selected item and calculate the vertical
        // space that can be used for an expanded item
        for(var i = 0; i < t.kids.length; i++) {
            var kid = t.kids[i];
            if (kid.isVisible) {
                if (kid.getValue() === false) {
                    var psh = kid.getPreferredSize().height;
                    eh -= psh;
                    kid.setSize(w, psh);
                }
            }
        }

        for(var i = 0; i < t.kids.length; i++) {
            var kid = t.kids[i];
            if (kid.isVisible) {
                kid.setLocation(x, y);
                if (kid.getValue()) {
                    kid.setSize(w, eh);
                }
                y += kid.height;
            }
        }
    }

    calcPreferredSize(t) {
        var w = 0, h = 0;
        for(var i = 0; i < t.kids.length; i++) {
            var kid = t.kids[i];
            if (kid.isVisible) {
                var ps = kid.getPreferredSize();
                h += ps.height
                if (ps.width > w) w = ps.width;
            }
        }
        return { width: w, height:h };
    }

    compAdded(e) {
        e.kid.setSwitchManager(this.group);
        if (this.group.selected === null) {
            this.group.setValue(e.kid, true);
        }
    }

    compRemoved(e) {
        if (this.group.selected === e.kid) {
            this.group.setValue(e.kid, false);
        }
        e.kid.setSwitchManager(null);
    }
}

function Clazz() {
    this.Label = Label;
    this.ImageLabel = ImageLabel
    this.TitlePan = StatePan;    
}

export default class ExtendablePan extends Panel, Switchable {
    get clazz() {
        return new Clazz();
    }

    constructor(lab, content, sm) {
        super();
        /**
         * Title panel
         * @type {zebkit.ui.Panel}
         * @attribute titlePan
         * @readOnly
         */
        this.titlePan = new this.clazz.TitlePan();
        this.add("top", this.titlePan);

        this.titlePan.add(new this.clazz.TogglePan());
        this.titlePan.add(pkg.$component(lab == null ? "" : lab, this));

        /**
         * Content panel
         * @type {zebkit.ui.Panel}
         * @readOnly
         * @attribute contentPan
         */
        this.contentPan = content;
        if (content != null) {
            this.add("center", this.contentPan);
        }
        this.setSwitchManager(arguments.length > 2 ? sm : new pkg.SwitchManager());        
    }

    switched() {
        var value = this.getValue();
        if (this.contentPan != null) {
            this.contentPan.setVisible(value);
        }

        if (this.titlePan != null) {
            this.titlePan.setState(value ? "on" : "off" );
        }
    }

    compEnabled(e) {
        if (this.titlePan != null) {
            var v = this.getValue();
            this.titlePan.setState(this.isEnable ? (v ? "on" : "off")
                                                  : (v ? "dison" : "disoff") );
        }
    }

    compRemoved(e) {
        if (this.titlePan === e.kid) {
            this.titlePan = null;
        } else if (e.kid === this.contentPan) {
            this.contentPan = null;
        }
    }
}