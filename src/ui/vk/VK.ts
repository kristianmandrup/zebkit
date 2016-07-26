import Panel from '../core/Panel';
import KeyEvent from '../web/keys/KeyEvent';

let KE = new KeyEvent();
KE.type = "vkb";


export default class VK extends Panel {
    get clazz() {
      return {
        Listeners: ListenersClass("vkMaskUpdated", "vkOptionSelected")
      };      
    };

    constructor() {
        super();

        this.mask = 0;

        this.$dontGrabFocus = true;

        this.eachGroupKey = function(g, f) {
            var g = this.getGroupPan(g);
            if (g != null) {
                for(var i = 0; i < g.kids.length; i++) {
                    var k = g.kids[i];
                    f.call(this, g, k);
                }
            }
        };

        this.eachKey = function(f) {
            for(var i = 0; i < this.kids.length; i++) {
                this.eachGroupKey(this.kids[i].name, f);
            }
        };

        this.show = function(d) {
            this.removeMe();
            if (d != null) {
                this.constraints = "bottom";
                this.toPreferredSize();

                if (pkg.makeEditorVisible === true) {
                    var p = zebkit.layout.toParentOrigin(d);
                    if (p.y + d.height > this.height) {
                        this.constraints = "top";
                    }
                }

                ui.showWindow(d, "mdi", this);
                var win = this.getCanvas().win;
                this.setSize(win.width - win.getLeft() - win.getRight(), this.height);
                ui.activateWindow(this);
            }
        };

        this.isShiftOn = function() {
            return (this.mask & ui.KeyEvent.M_SHIFT) > 0;
        };

        this.isAltOn = function() {
            return (this.mask & ui.KeyEvent.M_ALT) > 0;
        };

        this.isCtrlOn = function() {
            return (this.mask & ui.KeyEvent.M_CTRL) > 0;
        };

        this.onMask = function(mask, vk) {
            var oldMask = this.mask;
            if (mask != 0) {
                this.mask = mask | this.mask;
                if (oldMask != this.mask) {
                    this.vkMaskUpdated(vk, oldMask, this.mask);
                }
            }
        };

        this.offMask = function(mask, vk) {
            var oldMask = this.mask;
            if (mask != 0) {
                this.mask = mask ^ this.mask;
                if (oldMask != this.mask) {
                    this.vkMaskUpdated(vk, oldMask, this.mask);
                }
            }
        };

        this.vkOptionSelected = function(vkey, index, option) {
            this._.vkOptionSelected(vkey, index, option);
        };

        this.vkMaskUpdated = function(vkey, om, nm) {
            this.eachKey(function(g, k) {
                if (k != vkey && k.mask != 0 && k.mask != null) {
                    k.$syncMask(nm);
                }
            });

            this._.vkMaskUpdated(vkey, om, nm);
        };

        this.vkPressed = function (vk, code, ch, mask) {
            if (mask != 0) {
                this.onMask(mask, vk);
            }

            KE.ch = ch;
            KE.code = code;
            KE.$setMask(mask);
            this.getCanvas().$keyPressed(KE);
        };

        this.vkTyped = function (vk, code, ch, mask) {
            var ch = this.isShiftOn() ? ch.toUpperCase() : ch;
            KE.ch = ch;
            KE.code = code;
            KE.$setMask(mask);
            this.getCanvas().$keyTyped(KE);
        };

        this.vkReleased = function(vk, code, ch, mask) {
            if (mask != 0) {
                this.offMask(mask, vk);
            }
            KE.ch = ch;
            KE.code = code;
            KE.$setMask(mask);
            this.getCanvas().$keyReleased(KE);
        };

        this.setActiveGroup = function(name) {
            if (this.group != name) {
                this.group = name;
                for(var i = 0; i < this.kids.length; i++) {
                    var k = this.kids[i];
                    k.setVisible(k.name === name);
                }

                // adjust size if VK is shown
                var can = this.getCanvas();
                if (can != null && can.win != null) {
                    var win = can.win;
                    this.toPreferredSize();
                    this.setSize(win.width - win.getLeft() - win.getRight(), this.height);
                }
            }
        };

        this.getGroupPan = function(name) {
            for(var i = 0; i < this.kids.length; i++) {
                var k = this.kids[i];
                if (k.name === name) return k;
            }
            return null;
        };

        this.setGroups = function(groups) {
            for(var k in groups) {
                if (groups.hasOwnProperty(k)) {
                    this.addGroup(k, groups[k]);
                }
            }
        };

        this.addGroup = function(name, layout) {
            var group = new ui.Panel(new pkg.VKLayout());
            group.name = name;

            for(var row = 0; row < layout.length; row++) {
                var r = layout[row];
                for(var col = 0; col < r.length; col++) {
                    var v = r[col];

                    if (zebkit.isString(v)) {
                        if (pkg.PredefinedVKey.hasOwnProperty(v)) {
                            v = pkg.PredefinedVKey[v];
                        }
                    }

                    group.add({
                        row : row,
                        size: v.size
                    }, pkg.createVKey(v));
                }
            }
            this.add(group);
        };
    },

    function setParent(p) {
        // mean the vk is removed from its parent
        if (p == null) {
            if (this.parent != null) {
                // remove other VK related elements
                for(var i = this.parent.kids.length - 1; i >= 0; i--) {
                    var kid = this.parent.kids[i];
                    if (kid.$isVkElement === true) {
                        kid.removeMe();
                    }
                }
            }
        }

        this.$super(p);
    },

    function() {
        this.$super();
        this._ = new this.clazz.Listeners();
    }
}