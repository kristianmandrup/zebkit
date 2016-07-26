import { Button, Label } from '../';
import Font from '../Font'; 

function Clazz() {
    this.padding = 1;
    this.Label = Label;
    this.Label.font = new Font("Arial", "bold", 14);  
}

export default class VKeyBase extends Button {
    get clazz() {
      return new Clazz();
    }

    constructor(v) {
        super(v);
        this.$isVkElement = true;
        this.canHaveFocus = false;

        if (zebkit.isString(v) == false &&
            zebkit.instanceOf(v, ui.Panel) == false &&
            (v instanceof Image) == false)
        {
            v = ui.$view(v);

            if (zebkit.instanceOf(v, ui.ViewSet)) {
                this.statusViews    = v;
                this.statusViewKeys = [];
                this.statusKeyIndex = 0;
                for(var k in v.views) {
                    this.statusViewKeys.push(k);
                }
                this.statusViews.activate(this.statusViewKeys[0]);
            }
            v = new ui.ViewPan().setView(v);
            this.$super(v);
            this.setLayout(new zebkit.layout.StackLayout());
        }
    }

    showHint(ch) {
        this.hideHint();

        if (tooltip == null) {
            tooltip = new pkg.HintPan();
        }

        tooltip.setValue(ch);
        tooltip.toPreferredSize();
        var rl = zebkit.layout.toParentOrigin(this);
        if (rl.y - tooltip.height > 0) {
            tooltip.setLocation(rl.x, rl.y - tooltip.height);
        }
        else {
            tooltip.setLocation(rl.x, rl.y + this.height);
        }
        tooltip.setSize(this.width, tooltip.height);
        ui.showWindow(this, "info", tooltip);
    }

    hideHint() {
        if (tooltip != null) tooltip.removeMe();
    }

    findVK(id) {
        var p = this.parent;
        while(p != null && p[id] == null) p = p.parent;
        return p;
    }

    setLabel(l) {
        if (zebkit.instanceOf(this.kids[0], ui.Label)) {
            this.kids[0].setValue(l);
        }
    }

    getLabel() {
        return zebkit.instanceOf(this.kids[0], ui.Label) ? this.kids[0].getValue() : null;
    }

    nextStatusView() {
        if (this.statusViews != null) {
            this.statusKeyIndex = (this.statusKeyIndex + 1) % this.statusViewKeys.length;
            this.statusViews.activate(this.statusViewKeys[this.statusKeyIndex]);
            this.repaint();
        }
    }

    // static

    pointerPressed(e) {
        super.pointerPressed(e);
        this.nextStatusView();
    }
}