/**
 * UI popup layer class. Special layer implementation to show
 * context menu. Normally the layer is not used directly.
 * @class zebkit.ui.PopupLayer
 * @constructor
 * @extends {zebkit.ui.HtmlCanvas}
 */

import CanvasLayer from '../../core/CanvasLayer';
import { types } from '../../../utils';
import * as layout from '../../../layout';
import KeyEvent from '../../web/keys/KeyEvent';
import Menu from '../menu/Menu';

export default class PopupLayer extends CanvasLayer {
    get clazz() {
      return {
        ID: "pop"
      }      
    }

    activeMenubar: any;
    mTop: number;
    mLeft: number;
    mBottom: number;
    mRight: number;

    constructor() {
        super();
        this.activeMenubar = null;
        this.mTop = this.mLeft = this.mBottom = this.mRight = 0;
    }

    layerPointerPressed(e) {
        var b = false;
        if (this.activeMenubar != null) {
            // this code brings to error when pointer pressed
            // handled by other layer
            // this.activeMenubar.select(-1);
        }

        if (this.kids.length > 0) {
            //this.removeAll();
        }

        return b;
    }

    pointerPressed(e) {
        if (this.kids.length > 0) {
            this.removeAll();
        }
        return true;
    }

    getFocusRoot() {
        return this;
    }

    /**
     * Define children components input events handler.
     * @param  {zebkit.ui.KeyEvent} e an input event
     * @method childKeyPressed
     */
    childKeyPressed(e){
        var dc = layout.getDirectChild(this, e.source);

        if (this.activeMenubar != null && types.instanceOf(dc, Menu)) {
            var s = this.activeMenubar.selectedIndex;
            switch (e.code) {
                case KeyEvent.RIGHT :
                    if (s < this.activeMenubar.model.count()-1) {
                        //this.removeAll();
                        this.activeMenubar.requestFocus();
                        this.activeMenubar.position.seekLineTo("down");
                    }
                    break;
                case KeyEvent.LEFT :
                    if (s > 0) {
                        // this.removeAll();
                        this.activeMenubar.requestFocus();
                        this.activeMenubar.position.seekLineTo("up");
                    }
                    break;
            }
        }
    }

    calcPreferredSize(target){
        return { width:0, height:0 };
    }

    setMenubar(mb){
        if (this.activeMenubar != mb){
            this.removeAll();

            this.activeMenubar = mb;
            if (this.activeMenubar != null){
                // save an area the menu bar component takes
                // it is required to allow the menu bar getting input
                // event by inactivating the pop up layer
                var abs = layout.toParentOrigin(0, 0, this.activeMenubar);
                this.mLeft   = abs.x;
                this.mRight  = this.mLeft + this.activeMenubar.width - 1;
                this.mTop    = abs.y;
                this.mBottom = this.mTop + this.activeMenubar.height - 1;
            }
        }
    }

    doLayout(target){
        var cnt = this.kids.length;

        // TODO:
        // prove of concept. if layer is active don't allow WEB events comes to upper layer
        // since there can be another HtmlElement that should not be part of interaction
        if (this.$container != null) { // check existence of container DOM element since it can be not defined for Panel
            if (cnt > 0) {
                if (this.$container.style["pointer-events"] !== "auto") {
                    this.$container.style["pointer-events"] = "auto";
                }
            } else {
                if (this.$container.style["pointer-events"] !== "none") {
                    this.$container.style["pointer-events"] = "none";  // make the layer transparent for pointer events
                }
            }
        }

        for(var i = 0; i < cnt; i++){
            var m = this.kids[i];
            if (types.instanceOf(m, Menu)) {
                var ps = m.getPreferredSize(),
                    xx = (m.x + ps.width  > this.width ) ? this.width  - ps.width  : m.x,
                    yy = (m.y + ps.height > this.height) ? this.height - ps.height : m.y;

                m.setSize(ps.width, ps.height);
                if (xx < 0) xx = 0;
                if (yy < 0) yy = 0;
                m.setLocation(xx, yy);
            }
        }
    }

    // static

    getComponentAt(x, y) {
        return this.kids.length === 0 || (this.activeMenubar !== null &&
                                          y <= this.mBottom &&
                                          y >= this.mTop &&
                                          x >= this.mLeft &&
                                          x <= this.mRight    )   ? null : super.getComponentAt(x, y);
    }
}