import HtmlCanvas from './HtmlCanvas';

export default class zCanvas extends HtmlCanvas {
    $clazz = {
        CLASS_NAME: "zebcanvas"
    }

    $container: any; // DOM element
    $isRootCanvas: boolean;
    isSizeFull: boolean;

    constructor(element, w, h) {
        super(element);

        // no arguments
        if (arguments.length === 0) {
            w = 400;
            h = 400;
        } else {
            if (arguments.length === 1) {
                w = -1;
                h = -1;
            } else {
                if (arguments.length === 2) {
                    h = w;
                    w = element;
                    element = null;
                }
            }
        }

        // if passed element is string than consider it as
        // an ID of an element that is already in DOM tree
        if (zebkit.isString(element)) {
            var id = element;
            element = document.getElementById(id);

            // no canvas can be detected
            if (element == null) {
                throw new Error("Canvas id='" + id + "' element cannot be found");
            }
        }

        // since zCanvas is top level element it doesn't have to have
        // absolute position
        this.$container.style.position = "relative";

        // let canvas zCanvas listen WEB event
        this.$container.style["pointer-events"] = "auto";

        // if canvas is not yet part of HTML let's attach it to
        // body.
        if (this.$container.parentNode == null) {
            document.body.appendChild(this.$container);
        }

        // force canvas to have a focus
        if (this.element.getAttribute("tabindex") === null) {
            this.element.setAttribute("tabindex", "1");
        }

        if (w < 0) w = this.element.offsetWidth;
        if (h < 0) h = this.element.offsetHeight;

        // !!!
        // save canvas in list of created Zebkit canvases
        // do it before calling setSize(w,h) method
        pkg.$canvases.push(this);

        this.setSize(w, h);

        // sync canvas visibility with what canvas style says
        var cvis = (this.element.style.visibility == "hidden" ? false : true);
        if (this.isVisible != cvis) {
            this.setVisible(cvis);
        }

        // call event method if it is defined
        if (this.canvasInitialized != null) {
            this.canvasInitialized();
        }

        var $this = this;

        // this method should clean focus if
        // one of of a child DOM element gets focus
        zebkit.web.$focusin(this.$container, function(e) {
            if (e.target !== $this.$container &&
                e.target.parentNode != null &&
                e.target.parentNode.getAttribute("data-zebcont") == null)
            {
                pkg.focusManager.requestFocus(null);
            } else {
                // clear focus if a focus owner component is placed in another zCanvas
                if (e.target === $this.$container &&
                    pkg.focusManager.focusOwner != null &&
                    pkg.focusManager.focusOwner.getCanvas() !== $this)
                {
                    pkg.focusManager.requestFocus(null);
                }
            }
        }, true);
        this.$isRootCanvas   = true;
        this.isSizeFull      = false;
    }

    $toElementX(pageX, pageY) {
        pageX -= this.offx;
        pageY -= this.offy;

        var c = this.$context.$states[this.$context.$curState];
        return ((c.sx != 1 || c.sy != 1 || c.rotateVal !== 0) ? Math.round((c.crot * pageX + pageY * c.srot)/c.sx)
                                                              : pageX) - c.dx;
    }

    $toElementY(pageX, pageY) {
        pageX -= this.offx;
        pageY -= this.offy;

        var c = this.$context.$states[this.$context.$curState];
        return ((c.sx != 1 || c.sy != 1 || c.rotateVal !== 0) ? Math.round((pageY * c.crot - c.srot * pageX)/c.sy)
                                                              : pageY) - c.dy;
    }

    load(jsonPath, cb){
        return this.root.load(jsonPath, cb);
    };

    // TODO: may be rename to dedicated method $doWheelScroll
    $doScroll(dx, dy, src) {
        if (src === "wheel") {
            var owner = pkg.$pointerOwner.mouse;
            while (owner != null && owner.doScroll == null) {
                owner = owner.parent;
            }

            if (owner != null) {
                return owner.doScroll(dx, dy, src);
            }
        }
    }

    $keyTyped(e) {
        if (pkg.focusManager.focusOwner != null) {
            e.source = pkg.focusManager.focusOwner;
            return pkg.events.fireEvent("keyTyped", e);
        }
        return false;
    }

    $keyPressed(e) {
        for(var i = this.kids.length - 1;i >= 0; i--){
            var l = this.kids[i];
            if (l.layerKeyPressed != null && l.layerKeyPressed(e) === true) {
                return true;
            }
        }

        if (pkg.focusManager.focusOwner != null) {
            e.source = pkg.focusManager.focusOwner;
            return pkg.events.fireEvent("keyPressed", e);
        }

        return false;
    }

    $keyReleased(e){
        if (pkg.focusManager.focusOwner != null) {
            e.source = pkg.focusManager.focusOwner;
            return pkg.events.fireEvent("keyReleased", e);
        }
        return false;
    }

    $pointerEntered(e) {
        // TODO: review it quick and dirty fix try to track a situation
        //       when the canvas has been moved
        this.recalcOffset();

        var x = this.$toElementX(e.pageX, e.pageY),
            y = this.$toElementY(e.pageX, e.pageY),
            d = this.getComponentAt(x, y),
            o = pkg.$pointerOwner[e.identifier];

        // also correct current component on that  pointer is located
        if (d !== o) {
            // if pointer owner is not null but doesn't match new owner
            // generate pointer exit and clean pointer owner
            if (o != null) {
                pkg.$pointerOwner[e.identifier] = null;
                pkg.events.fireEvent("pointerExited", e.update(o, x, y));
            }

            // if new pointer owner is not null and enabled
            // generate pointer entered event ans set new pointer owner
            if (d != null && d.isEnabled === true){
                pkg.$pointerOwner[e.identifier] = d;
                pkg.events.fireEvent("pointerEntered", e.update(d, x, y));
            }
        }
    }

    $pointerExited(e) {
        var o = pkg.$pointerOwner[e.identifier];
        if (o != null) {
            pkg.$pointerOwner[e.identifier] = null;
            return pkg.events.fireEvent("pointerExited", e.update(o,
                                                                  this.$toElementX(e.pageX, e.pageY),
                                                                  this.$toElementY(e.pageX, e.pageY)));
        }
    }

    /**
     * Catch native canvas pointer move events
     * @param {String} id an touch id (for touchable devices)
     * @param {String} e a pointer event that has been triggered by canvas element
     *
     *         {
     *             pageX : {Integer},
     *             pageY : {Integer},
     *             target: {HTMLElement}
     *         }
     * @protected
     * @method $pointerMoved
     */
    $pointerMoved(e){
        // if a pointer button has not been pressed handle the normal pointer moved event
        var x = this.$toElementX(e.pageX, e.pageY),
            y = this.$toElementY(e.pageX, e.pageY),
            d = this.getComponentAt(x, y),
            o = pkg.$pointerOwner[e.identifier],
            b = false;

        // check if pointer already inside a component
        if (o != null) {
            if (d != o) {
                pkg.$pointerOwner[e.identifier] = null;
                b = pkg.events.fireEvent("pointerExited", e.update(o, x, y));

                if (d != null && d.isEnabled === true) {
                    pkg.$pointerOwner[e.identifier] = d;
                    b = pkg.events.fireEvent("pointerEntered", e.update(d, x, y)) || b;
                }
            } else {
                if (d != null && d.isEnabled === true) {
                    b = pkg.events.fireEvent("pointerMoved", e.update(d, x, y));
                }
            }
        } else {
            if (d != null && d.isEnabled === true) {
                pkg.$pointerOwner[e.identifier] = d;
                b = pkg.events.fireEvent("pointerEntered", e.update(d, x, y));
            }
        }

        return b;
    }

    $pointerDragStarted(e) {
        var x = this.$toElementX(e.pageX, e.pageY),
            y = this.$toElementY(e.pageX, e.pageY),
            d = this.getComponentAt(x, y);

        // if target component can be detected fire pointer start dragging and
        // pointer dragged events to the component
        if (d != null && d.isEnabled === true) {
            return pkg.events.fireEvent("pointerDragStarted", e.update(d, x, y));
        }

        return false;
    }

    $pointerDragged(e){
        if (pkg.$pointerOwner[e.identifier] != null) {
            return pkg.events.fireEvent("pointerDragged", e.update(pkg.$pointerOwner[e.identifier],
                                                                    this.$toElementX(e.pageX, e.pageY),
                                                                    this.$toElementY(e.pageX, e.pageY)));
        }

        return false;
    }

    $pointerDragEnded(e) {
        if (pkg.$pointerOwner[e.identifier] != null) {
            return pkg.events.fireEvent("pointerDragEnded", e.update(pkg.$pointerOwner[e.identifier],
                                                                      this.$toElementX(e.pageX, e.pageY),
                                                                      this.$toElementY(e.pageX, e.pageY)));
        }
        return false;
    }

    $pointerClicked(e) {
        var x = this.$toElementX(e.pageX, e.pageY),
            y = this.$toElementY(e.pageX, e.pageY),
            d = this.getComponentAt(x, y);

        return d != null ? pkg.events.fireEvent("pointerClicked", e.update(d, x, y))
                          : false;
    }

    $pointerDoubleClicked(e) {
        var x = this.$toElementX(e.pageX, e.pageY),
            y = this.$toElementY(e.pageX, e.pageY),
            d = this.getComponentAt(x, y);

        return d != null ? pkg.events.fireEvent("pointerDoubleClicked", e.update(d, x, y))
                          : false;
    }

    $pointerReleased(e) {
        var x  = this.$toElementX(e.pageX, e.pageY),
            y  = this.$toElementY(e.pageX, e.pageY),
            pp = pkg.$pointerPressedOwner[e.identifier];

        // release pressed state
        if (pp != null) {
            try {
                pkg.events.fireEvent("pointerReleased", e.update(pp, x, y));
            } finally {
                pkg.$pointerPressedOwner[e.identifier] = null;
            }
        }

        // mouse released can happen at new location, so move owner has to be corrected
        // and mouse exited entered event has to be generated.
        // the correction takes effect if we have just completed dragging or mouse pressed
        // event target doesn't match pkg.$pointerOwner
        if (e.pointerType === "mouse" && (e.pressPageX != e.pageX || e.pressPageY != e.pageY)) {
            var nd = this.getComponentAt(x, y),
                po = this.getComponentAt(this.$toElementX(e.pressPageX, e.pressPageY),
                                          this.$toElementY(e.pressPageX, e.pressPageY));

            if (nd !== po) {
                if (po != null) {
                    pkg.$pointerOwner[e.identifier] = null;
                    pkg.events.fireEvent("pointerExited", e.update(po, x, y));
                }

                if (nd != null && nd.isEnabled === true){
                    pkg.$pointerOwner[e.identifier] = nd;
                    pkg.events.fireEvent("pointerEntered", e.update(nd, x, y));
                }
            }
        }
    }

    $pointerPressed(e) {
        var x  = this.$toElementX(e.pageX, e.pageY),
            y  = this.$toElementY(e.pageX, e.pageY),
            pp = pkg.$pointerPressedOwner[e.identifier];

        // free pointer prev presssed if any
        if (pp != null) {
            try {
                pkg.events.fireEvent("pointerReleased", e.update(pp, x, y));
            } finally {
                pkg.$pointerPressedOwner[e.identifier] = null;
            }
        }

        // adjust event for passing it to layers
        e.x = x;
        e.y = y;
        e.source = null;

        // send pointer event to a layer and test if it has been activated
        for(var i = this.kids.length - 1; i >= 0; i--){
            var tl = this.kids[i];
            if (tl.layerPointerPressed != null) {
                e.id = "pointerPressed";
                if (tl.layerPointerPressed(e) === true) {
                    return true;
                }
            }
        }

        var d = this.getComponentAt(x, y);

        if (d != null && d.isEnabled === true) {
            if (pkg.$pointerOwner[e.identifier] !== d) {
                pkg.$pointerOwner[e.identifier] = d;
                pkg.events.fireEvent("pointerEntered",  e.update(d, x, y));
            }

            pkg.$pointerPressedOwner[e.identifier] = d;

            // TODO: prove the solution (returning true) !?
            if (pkg.events.fireEvent("pointerPressed", e.update(d, x, y)) === true) {
                delete pkg.$pointerPressedOwner[e.identifier];
                return true;
            }
        }

        return false;
    }

    getComponentAt(x, y){
        for(var i = this.kids.length; --i >= 0; ){
            var c = this.kids[i].getComponentAt(x, y);
            if (c != null) {
                var p = c;
                while ((p = p.parent) != null) {
                    if (p.catchInput != null && (p.catchInput === true || (p.catchInput !== false && p.catchInput(c)))) {
                        c = p;
                    }
                }
                return c;
            }
        }
        return null;
    }

    recalcOffset() {
        // calculate the DOM element offset relative to window taking in account
        // scrolling
        var poffx = this.offx,
            poffy = this.offy,
            ba    = this.$container.getBoundingClientRect();

        this.offx = Math.round(ba.left) + zebkit.web.$measure(this.$container, "border-left-width") +
                                          zebkit.web.$measure(this.$container, "padding-left") +
                                          window.pageXOffset;
        this.offy = Math.round(ba.top) +  zebkit.web.$measure(this.$container, "padding-top" ) +
                                          zebkit.web.$measure(this.$container, "border-top-width") +
                                          window.pageYOffset;

        if (this.offx != poffx || this.offy != poffy) {
            // force to fire component re-located event
            this.relocated(this, poffx, poffy);
        }
    }

    /**
     * Get the canvas layer by the specified layer ID. Layer is a children component
     * of the canvas UI component. Every layer has an ID assigned to it the method
     * actually allows developers to get the canvas children component by its ID
     * @param  {String} id a layer ID
     * @return {zebkit.ui.Panel} a layer (children) component
     * @method getLayer
     */
    getLayer(id) {
        return this[id];
    }

    // override relocated and resized
    // to prevent unnecessary repainting
    relocated(px,py) {
        COMP_EVENT.source = this;
        COMP_EVENT.px     = px;
        COMP_EVENT.py     = py;
        pkg.events.fireEvent("compMoved", COMP_EVENT);
    }

    resized(pw,ph) {
        COMP_EVENT.source = this;
        COMP_EVENT.prevWidth  = pw;
        COMP_EVENT.prevHeight = ph;
        pkg.events.fireEvent("compSized", COMP_EVENT);
        // don't forget repaint it
        this.repaint();
    }

    $initListeners() {
        // TODO: hard-coded
        new pkg.PointerEventUnifier(this.$container, this);
        new pkg.KeyEventUnifier(this.element, this); // element has to be used since canvas is
                                                      // styled to have focus and get key events
        new pkg.MouseWheelSupport(this.$container, this);
    }

    fullScreen() {
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        //}
    //    document.documentElement.webkitRequestFullscreen();
    }

    setSize(w, h) {
        if (this.width != w || h != this.height) {
            super.setSize(w, h);

            // let know to other zebkit canvases that
            // the size of an element on the page has
            // been updated and they have to correct
            // its anchor.
            pkg.$elBoundsUpdated();
        }
        return this;
    }

    fullSize() {
        /**
         * Indicate if the canvas has to be stretched to
         * fill the whole screen area.
         * @type {Boolean}
         * @attribute isFullSize
         * @readOnly
         */
        if (this.isFullSize !== true) {
            if (zebkit.web.$contains(this.$container) !== true) {
                throw new Error("zCanvas is not a part of DOM tree");
            }

            this.isFullSize = true;
            this.setLocation(0, 0);

            // adjust body to kill unnecessary gap for inline-block zCanvas element
            // otherwise body size will be slightly horizontally bigger than visual
            // viewport height what causes scroller appears
            document.body.style["font-size"] = "0px";

            var ws = zebkit.web.$viewPortSize();
            this.setSize(ws.width, ws.height);
        }
    }

    setVisible(b) {
        var prev = this.isVisible;
        super.setVisible(b);

        // Since zCanvas has no parent component calling the super
        // method above doesn't trigger repainting. So, do it here.
        if (b != prev) {
            this.repaint();
        }
        return this;
    }

    vrp() {
        super.vrp();
        if (zebkit.web.$contains(this.element) && this.element.style.visibility === "visible") {
            this.repaint();
        }
    }

    kidAdded(i,constr,c){
        if (typeof this[c.id] !== "undefined") {
            throw new Error("Layer '" + c.id + "' already exist");
        }

        this[c.id] = c;
        super.kidAdded(i, constr, c);
    }

    kidRemoved(i, c){
        delete this[c.id];
        super.kidRemoved(i, c);
    }
}
