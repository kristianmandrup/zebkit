/**
 * Window layer class. Window layer is supposed to be used for showing
 * modal and none modal internal window. There are special ready to use
 * "zebkit.ui.Window" UI component that can be shown as internal window, but
 * zebkit allows developers to show any UI component as modal or none modal
 * window. Add an UI component to window layer to show it as modal o none
 * modal window:

        // create canvas
        var canvas   = new zebkit.ui.zCanvas();

        // get windows layer
        var winLayer = canvas.getLayer(zebkit.ui.WinLayer.ID);

        // create standard UI window component
        var win = new zebkit.ui.Window();
        win.setBounds(10,10,200,200);

        // show the created window as modal window
        winLayer.addWin("modal", win);

 * Also shortcut method can be used

        // create canvas
        var canvas   = new zebkit.ui.zCanvas();

        // create standard UI window component
        var win = new zebkit.ui.Window();
        win.setBounds(10,10,200,200);

        // show the created window as modal window
        zebkit.ui.showModalWindow(canvas, win);

 * Window layer supports three types of windows:

    - **"modal"** a modal window catches all input till it will be closed
    - **"mdi"** a MDI window can get focus, but it doesn't block switching
    focus to other UI elements
    - **"info"** an INFO window cannot get focus. It is supposed to show
    some information like tooltip.

 * @class zebkit.ui.WinLayer
 * @constructor
 * @extends {zebkit.ui.HtmlCanvas}
 */

import CanvasLayer from '../core/CanvasLayer';
import { RasterLayout } from '../../layout';

export default class WinLayer extends CanvasLayer {
    get clazz() {
      return {
        ID: "win",
        layout: new RasterLayout()
      }
    }
    
    activeWin: any;
    topModalIndex: number;
    winsStack: any[];
    winsListeners: Object;
    winsTypes: Object;

    constructor(e?) {
        super(e);

        /**
         * Currently activated as a window children component
         * @attribute activeWin
         * @type {zebkit.ui.Panel}
         * @readOnly
         * @protected
         */
        this.activeWin     = null;
        this.topModalIndex = -1;
        this.winsStack     = [];
        this.winsListeners = {};
        this.winsTypes     = {};

        // TODO: why 1000 and how to avoid z-index manipulation
        // the layer has to be placed above other elements that are virtually
        // inserted in the layer
        // TODO: this line brings to fails if window layer inherits Panel
        if (typeof this.element !== "undefined") {
            this.element.style["z-index"] = "10000";
        }        
    }

    layerPointerPressed(e) {
        if (this.kids.length > 0) {

            if (this.activeWin != null && this.indexOf(this.activeWin) === this.kids.length - 1) {
                var x1 = this.activeWin.x,
                    y1 = this.activeWin.y,
                    x2 = x1 + this.activeWin.width,
                    y2 = y1 + this.activeWin.height;

                if (e.x >= x1 && e.y >= y1 && e.x < x2 && e.y < y2) {
                    return false;
                }
            }

            // otherwise looking for a window starting from the topest one
            for(var i = this.kids.length - 1; i >= 0 && i >= this.topModalIndex; i--){
                var d = this.kids[i];
                if (d.isVisible &&
                    d.isEnabled &&
                    this.winsTypes[d] !== "info" &&
                    e.x >= d.x &&
                    e.y >= d.y &&
                    e.x < d.x + d.width &&
                    e.y < d.y + d.height)
                {
                    this.activate(d);
                    return true;
                }
            }

            if (this.topModalIndex < 0 && this.activeWin != null) {
                this.activate(null);
                return false;
            }
        }
        return false;
    }

    layerKeyPressed(e){
        if (this.kids.length > 0        &&
            e.code === pkg.KeyEvent.TAB &&
            e.shiftKey                     )
        {
            if (this.activeWin == null) {
                this.activate(this.kids[this.kids.length - 1]);
            } else {
                var winIndex = this.winsStack.indexOf(this.activeWin) - 1;
                if (winIndex < this.topModalIndex || winIndex < 0) {
                    winIndex = this.winsStack.length - 1;
                }
                this.activate(this.winsStack[winIndex]);
            }

            return true;
        }
        return false;
    }

    // TODO: the method never called since focus has been re-worked
    elementFocusLost(src) {
        if (this.activeWin != null && this.getWinType(this.activeWin) === "mdi") {
            this.$prevActiveWin = this.activeWin;
            this.activate(null);
        }
    }

    // TODO: the method never called since focus has been re-worked
    elementFocusGained(src) {
        if (this.$prevActiveWin != null &&
            this.$prevActiveWin.isVisible === true &&
            this.$prevActiveWin.parent === this)
        {
            this.activate(this.$prevActiveWin);
        }
        this.$prevActiveWin = null;
    }

    /**
     * Define children components input events handler.
     * @param  {zebkit.ui.FocusEvent} e a focus event
     * @method childFocusGained
     */
    childFocusGained(e) {
        this.activate(zebkit.layout.getDirectChild(this, e.source));
    }

    getFocusRoot() {
        return this.activeWin;
    };

    getWinType(w) {
        return this.winsTypes[w];
    };

    /**
     * Activate the given win layer children component window.
     * @param  {zebkit.ui.Panel} c a component to be activated as window
     * @method activate
     */
    activate(c) {
        if (c != null && (this.kids.indexOf(c) < 0 ||
                          this.winsTypes[c] === "info"))
        {
            throw new Error("Window cannot be activated");
        }

        if (c != this.activeWin) {
            var old = this.activeWin;
            if (c == null) {
                var type = this.winsTypes[this.activeWin];
                if (type === "modal") {
                    throw new Error("Modal window cannot be de-activated");
                }

                this.activeWin = null;
                this.fire("winActivated", WIN_EVENT.$fillWith(old, this, false, false));

                // TODO: special flag $dontGrabFocus is not very elegant
                if (type === "mdi" && old.$dontGrabFocus !== true) {
                    pkg.focusManager.requestFocus(null);
                }
            } else {
                if (this.winsStack.indexOf(c) < this.topModalIndex) {
                    throw new Error();
                }

                this.activeWin = c;
                this.activeWin.toFront();

                if (old != null) {
                    this.fire("winActivated", WIN_EVENT.$fillWith(old, this, false, false));
                }

                this.fire("winActivated", WIN_EVENT.$fillWith(c, this, true, false));
                this.activeWin.validate();

                var type = this.winsTypes[this.activeWin];
                // TODO: special flag $dontGrabFocus is not very elegant
                if (type === "mdi" && this.activeWin.$dontGrabFocus !== true) {
                    var newFocusable = pkg.focusManager.findFocusable(this.activeWin);
                    pkg.focusManager.requestFocus(newFocusable);
                }
            }
        }
    }

    fire(id, e, l) {
        if (arguments.length < 3) {
            l = this.winsListeners[e.source];
        }

        pkg.events.fireEvent(id, e);
        if (l != null && l[id] != null) {
            l[id].call(l, e);
        }
    }

    /**
     * Add the given window with the given type and the listener to the layer.
     * @param {String} [type]   a type of the window: "modal",
     * "mdi" or "info"
     * @param {zebkit.ui.Panel} win an UI component to be shown as window
     * @param {Object} [listener] an optional the window listener

      {
          winActivated : function(e) {

          },

          winOpened : function(e) {

          }
      }

      * @method addWin
      */
    addWin(type, win, listener) {
        // check if window type argument has been passed
        if (zebkit.instanceOf(type, pkg.Panel) ) {
            listener = win;
            win      = type;
        } else {
            this.winsTypes[win] = type;
        }

        this.winsListeners[win] = listener;
        this.add(win);
    }

    getComponentAt(x, y) {
        return (this.activeWin === null) ? null
                                          : this.activeWin.getComponentAt(x - this.activeWin.x,
                                                                          y - this.activeWin.y);
    }

    // static

    insert(index, constr, lw) {
        var type = this.winsTypes[lw];

        if (typeof type === 'undefined') {
            type = lw.winType != null ? lw.winType : "mdi";
        }

        if (type !== "mdi" && type !== "modal" && type !== "info") {
            throw new Error("Invalid window type: " + type);
        }

        this.winsTypes[lw] = type;
        return super.insert(index, constr, lw);
    }

    kidAdded(index, constr, lw){
        super.kidAdded(index, constr, lw);

        var type = this.winsTypes[lw];
        this.winsStack.push(lw);
        if (type === "modal") {
            this.topModalIndex = this.winsStack.length - 1;
            this.fire("winOpened", WIN_EVENT.$fillWith(lw, this, false, true));
            this.activate(lw);
        } else {
            this.fire("winOpened", WIN_EVENT.$fillWith(lw, this, false, true));
        }
    }

    kidRemoved(index,lw){
        try {
            super.kidRemoved(this, index, lw);

            var l = this.winsListeners[lw];
            if (this.activeWin === lw) {
                this.activeWin = null;

                // TODO:  deactivated event can be used
                // as a trigger of a window closing so
                // it is better don't fire it here
                // this.fire("winActivated", lw, l);
                if (this.winsTypes[lw] === "mdi" && lw.$dontGrabFocus !== true) {
                    pkg.focusManager.requestFocus(null);
                }
            }

            var ci = this.winsStack.indexOf(lw);
            this.winsStack.splice(this.winsStack.indexOf(lw), 1);

            if (ci < this.topModalIndex) {
                this.topModalIndex--;
            } else {
                if (this.topModalIndex === ci){
                    for(this.topModalIndex = this.kids.length - 1;this.topModalIndex >= 0; this.topModalIndex--){
                        if (this.winsTypes[this.winsStack[this.topModalIndex]] === "modal") {
                            break;
                        }
                    }
                }
            }

            this.fire("winOpened", WIN_EVENT.$fillWith(lw, this, false, false), l);

            if (this.topModalIndex >= 0){
                var aindex = this.winsStack.length - 1;
                while(this.winsTypes[this.winsStack[aindex]] === "info") {
                    aindex--;
                }
                this.activate(this.winsStack[aindex]);
            }
        } finally {
            delete this.winsTypes[lw];
            delete this.winsListeners[lw];
        }
    }
}