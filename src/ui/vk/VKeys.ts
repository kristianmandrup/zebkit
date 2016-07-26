import VKey from './VKey';

import RasterLayout from '../../layout/RasterLayout';
import Panel from '../core/Panel';
import { Label } from '../';
import Font from '../Font';

class RL extends RasterLayout {
    // static

    calcPreferredSize(t) {
        var w = 0, h = 0;
        for (var i = 0; i < t.kids.length; i++) {
            if (t.kids[i].isVisible === true) {
                var ps = t.kids[i].getPreferredSize();
                w += ps.width;
                h += ps.height;
            }
        }
        return { width: w, height: h };
    }
}

class KeysLabelPan extends Panel {
    get clazz() {
        return {
          layout: new RL(true)
        };
    }

    constructor(chars) {
        super();
        this.constraints = "center";

        var mainLab = new pkg.VKeys.Label(chars[0]),
            altLab  = new pkg.VKeys.SmallLabel(chars.length == 2 ? chars[1] : "...");

        mainLab.constraints = "center";
        altLab.constraints  = "topRight";
        this.add(mainLab);
        this.add(altLab);

        this.mainLab = mainLab;
    }
}

class KeysPopupPan extends Panel {
    clazz() {
        this.layout     = new zebkit.layout.FlowLayout("left", "center", "horizontal", 6);
        this.padding    = 6;
        this.border     = new ui.Border("plain");
        this.background = "rgba(200,200,200,0.8)";
    }

    constructor() {
        super();
        this.$dontGrabFocus = this.$isVkElement = true;
    }
}

import BorderLayout from '../../layout/BorderLayout';

function Clazz() {
    this.layout = new BorderLayout();

    this.SmallLabel = Label;
    this.SmallLabel.font = new Font(pkg.VKey.Label.font.name, Math.floor((2 * VKey.Label.font.height)/3));

    this.KeysPopupPan = KeysPopupPan;
    this.KeysLabelPan = KeysLabelPan;
}


export default class VKeys extends VKey {
    get clazz () {
      return new Clazz();
    }

    keysPopupPan: any;

    constructor(chars : string) {
        super();

        if (chars.length < 2) {
            throw new Error();
        }

        // super.init{
        //     ch    : chars[0],
        //     label : new this.clazz.KeysLabelPan(chars)
        // }

        this.keysPopupPan = null;

        if (chars.length > 2) {
            this.keysPopupPan = new this.clazz.KeysPopupPan();

            var $this = this;
            for(var i = 1; i < chars.length; i++) {
                var key =  pkg.createVKey(chars[i]);
                key.extend([
                    function findVK(id) {
                        return $this.findVK(id);
                    },

                    function fireVkReleased(code, ch, mask) {
                        this.$super(code, ch, mask);
                        $this.hideKeysPopupPan();
                    }
                ]);
                this.keysPopupPan.add(key);
            }
        }
        else {
            this.altCh = chars[1];
        }        
    }

    getLabel() {
        return this.kids[0].mainLab.getValue();
    }

    setLabel(l) {
        this.kids[0].mainLab.setValue(l);
    }

    showKeysPopupPan() {
        this.hideHint();

        if (this.keysPopupPan == null) {
            this.$counter = (this.$counter + 1 ) % 2;
            this.showHint(this.$counter === 0 ? this.ch : this.altCh);
        }
        else {
            this.$pressed.shutdown();

            var rl = zebkit.layout.toParentOrigin(this);
            for(var i = 0; i < this.keysPopupPan.kids.length; i++) {
                this.keysPopupPan.kids[i].setPreferredSize(this.width, this.height);
            }

            this.keysPopupPan.toPreferredSize();
            this.keysPopupPan.setLocation(rl.x, rl.y - this.keysPopupPan.height);
            ui.showWindow(this, "mdi", this.keysPopupPan, {
                winActivated : function (e) {
                    if (e.isActive === false) {
                        e.source.removeMe();
                    }
                }
            });
            ui.makeFullyVisible(this.keysPopupPan);
            ui.activateWindow(this.keysPopupPan);

            this.setState("out");
        }
    }

    hideKeysPopupPan() {
        if (this.keysPopupPan != null) {
            this.keysPopupPan.removeMe();
        }
    }

    // static

    fireVkPressed(e) {
        this.$counter = 0;
        this.hideKeysPopupPan();
        super.fireVkPressed(e);
        this.$pressed = zebkit.util.task(this.showKeysPopupPan, this).run(700, 700);
    }

    fireVkTyped(code, ch, mask) {
        if (this.keysPopupPan == null) {
            ch = this.$counter > 0 ? this.altCh : this.ch;
            super.fireVkTyped(ch.charCodeAt(0), ch, mask);
        }
        else {
            if (this.keysPopupPan.parent == null) {
                super.fireVkTyped(code, ch, mask);
            }
        }
    }

    fireVkReleased(code, ch, mask) {
        this.$pressed.shutdown();
        super.fireVkReleased(code, ch, mask);
    }
}