/**
 * Status bar UI component class
 * @class zebkit.ui.StatusBar
 * @param {Integer} [gap] a gap between status bar children elements
 * @extends {zebkit.ui.Panel}
 */

import Panel from './core/Panel';
import layout from '../layout';

export default class StatusBar extends Panel {
    constructor(gap){
        super(new layout.PercentLayout("horizontal", gap));
        if (arguments.length === 0) gap = 2;
        this.setPadding(gap, 0, 0, 0);
        
    }

    // static

    /**
     * Set the specified border to be applied for status bar children components
     * @param {zebkit.ui.View} v a border
     * @method setBorderView
     */
    setBorderView(v){
        if (v != this.borderView){
            this.borderView = v;
            for(var i = 0;i < this.kids.length; i++) {
                this.kids[i].setBorder(this.borderView);
            }
            this.repaint();
        }
        return this;
    }

    insert(i,s,d){
        d.setBorder(this.borderView);
        super.insert(i, s, d);
    }
}
