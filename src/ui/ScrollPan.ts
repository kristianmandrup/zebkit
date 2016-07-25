/**
 * Scroll UI panel. The component is used to manage scrolling
 * for a children UI component that occupies more space than
 * it is available. The usage is very simple, just put an component
 * you want to scroll horizontally or/and vertically in the scroll
 * panel:

        // scroll vertically and horizontally a large picture
        var scrollPan = new zebkit.ui.ScrollPan(new zebkit.ui.ImagePan("largePicture.jpg"));

        // scroll vertically  a large picture
        var scrollPan = new zebkit.ui.ScrollPan(new zebkit.ui.ImagePan("largePicture.jpg"),
                                               "vertical");

        // scroll horizontally a large picture
        var scrollPan = new zebkit.ui.ScrollPan(new zebkit.ui.ImagePan("largePicture.jpg"),
                                               "horizontal");



 * @param {zebkit.ui.Panel} [c] an UI component that has to be placed into scroll panel
 * @param {String} [scrolls] a scroll bars that have to be shown. Use "vertical", "horizontal"
 * or "both" string value to control scroll bars visibility. By default the value is "both"
 * @constructor
 * @param {Boolean} [autoHide] a boolean value that says if the scrollbars have to work in
 * auto hide mode. Pass true to switch scrollbars in auto hide mode. By default the value is
 * false
 * @class zebkit.ui.ScrollPan
 * @extends {zebkit.ui.Panel}
 */
export default class ScrollPan extends Panel {
    $clazz = ()  => {
        this.ContentPanLayout = Class(zebkit.layout.Layout, [
            function $prototype() {
                this.calcPreferredSize = function(t) {
                    return t.kids[0].getPreferredSize();
                };

                this.doLayout = function(t) {
                    var kid = t.kids[0];
                    if (kid.constraints === "stretch") {
                        var ps = kid.getPreferredSize(),
                            w  = t.parent.hBar != null ? ps.width : t.width,
                            h  = t.parent.vBar != null ? ps.height : t.height;
                        kid.setSize(w, h);
                    }
                    else {
                        kid.toPreferredSize();
                    }
                };
            }
        ]);

        var SM = this.ContentPanScrollManager = Class(pkg.ScrollManager, [
            function $prototype() {
                this.getSX = function() {
                    return this.target.x;
                };

                this.getSY = function() {
                    return this.target.y;
                };

                this.scrollStateUpdated = function(sx,sy,psx,psy) {
                    this.target.setLocation(sx, sy);
                };
            }
        ]);

        var contentPanLayout = new this.ContentPanLayout();
        this.ContentPan = Class(pkg.Panel, [
            function(c) {
                this.$super(contentPanLayout);
                this.scrollManager = new SM(c);
                this.add(c);
            }
        ]);
    }

    constructor(c, scrolls, autoHide) {
        super();
        /**
         * Indicate if the scroll bars should be hidden
         * when they are not active
         * @attribute autoHide
         * @type {Boolean}
         * @readOnly
         */
        this.autoHide  = false;
        this.$interval = 0;

        if (scrolls == null)  {
            scrolls = "both";
        }

        /**
         * Vertical scroll bar component
         * @attribute vBar
         * @type {zebkit.ui.Scroll}
         * @readOnly
         */

        /**
         * Horizontal scroll bar component
         * @attribute hBar
         * @type {zebkit.ui.Scroll}
         * @readOnly
         */

        /**
         * Scrollable target component
         * @attribute scrollObj
         * @type {zebkit.ui.Panel}
         * @readOnly
         */

        this.hBar = this.vBar = this.scrollObj = null;
        this.$isPosChangedLocked = false;
        this.$super();

        if (arguments.length < 2 || scrolls === "both" || scrolls === "horizontal") {
            this.add("bottom", new pkg.Scroll("horizontal"));
        }

        if (arguments.length < 2 || scrolls === "both" || scrolls === "vertical") {
            this.add("right", new pkg.Scroll("vertical"));
        }

        if (c != null) {
            this.add("center", c);
        }

        if (arguments.length > 2) {
            this.setAutoHide(autoHide);
        }
    }

    /**
     * Set the given auto hide state.
     * @param  {Boolean} b an auto hide state.
     * @method setAutoHide
     */
    setAutoHide(b) {
        if (this.autoHide != b) {
            this.autoHide = b;
            if (this.hBar != null) {
                if (this.hBar.incBt != null) this.hBar.incBt.setVisible(!b);
                if (this.hBar.decBt != null) this.hBar.decBt.setVisible(!b);
            }

            if (this.vBar != null) {
                if (this.vBar.incBt != null) this.vBar.incBt.setVisible(!b);
                if (this.vBar.decBt != null) this.vBar.decBt.setVisible(!b);
            }

            if (this.$interval !== 0) {
                clearInterval(this.$interval);
                $this.$interval = 0;
            }

            this.vrp();
        }
        return this;
    };

    /**
     * Scroll horizontally and vertically to the given positions
     * @param  {Integer} sx a horizontal position
     * @param  {Integer} sy a vertical position
     * @method scrollTo
     */
    scrollTo(sx, sy) {
        this.scrollObj.scrollManager.scrollTo(sx, sy);
    };

    /**
     * Scroll horizontally
     * @param  {Integer} sx a position
     * @method scrollXTo
     */
    scrollXTo(sx) {
        this.scrollObj.scrollManager.scrollXTo(sx);
    };

    /**
     * Scroll vertically
     * @param  {Integer} sy a position
     * @method scrollYTo
     */
    scrollYTo(sx, sy) {
        this.scrollObj.scrollManager.scrollYTo(sy);
    };

    doScroll(dx, dy, source) {
        var b = false;

        if (dy !== 0 && this.vBar != null && this.vBar.isVisible === true) {
            var v =  this.vBar.position.offset + dy;
            if (v >= 0) this.vBar.position.setOffset(v);
            else        this.vBar.position.setOffset(0);
            b = true;
        }

        if (dx !== 0 && this.hBar != null && this.hBar.isVisible === true) {
            var v =  this.hBar.position.offset + dx;
            if (v >= 0) this.hBar.position.setOffset(v);
            else        this.hBar.position.setOffset(0);
            b = true;
        }
        return b;
    };

    /**
     * Scroll manager listener method that is called every time
     * a target component has been scrolled
     * @param  {Integer} psx previous scroll x location
     * @param  {Integer} psy previous scroll y location
     * @method  scrolled
     */
    scrolled(psx,psy){
        try {
            this.validate();
            this.$isPosChangedLocked = true;

            if (this.hBar != null) {
                this.hBar.position.setOffset( -this.scrollObj.scrollManager.getSX());
            }

            if (this.vBar != null) {
                this.vBar.position.setOffset( -this.scrollObj.scrollManager.getSY());
            }

            if (this.scrollObj.scrollManager == null) this.invalidate();

            this.$isPosChangedLocked = false;
        }
        catch(e) { this.$isPosChangedLocked = false; throw e; }
    };

    calcPreferredSize(target){
        return pkg.$getPS(this.scrollObj);
    };

    doLayout(target){
        var sman   = (this.scrollObj == null) ? null : this.scrollObj.scrollManager,
            right  = this.getRight(),
            top    = this.getTop(),
            bottom = this.getBottom(),
            left   = this.getLeft(),
            ww     = this.width  - left - right,  maxH = ww,
            hh     = this.height - top  - bottom, maxV = hh,
            so     = this.scrollObj.getPreferredSize(),
            vps    = this.vBar == null ? { width:0, height:0 } : this.vBar.getPreferredSize(),
            hps    = this.hBar == null ? { width:0, height:0 } : this.hBar.getPreferredSize();

        // compensate scrolled vertical size by reduction of horizontal bar height if necessary
        // autoHidded scrollbars don't have an influence to layout
        if (this.hBar != null && this.autoHide === false &&
              (so.width  > ww ||
              (so.height > hh && so.width > (ww - vps.width))))
        {
            maxV -= hps.height;
        }
        maxV = so.height > maxV ? (so.height - maxV) :  -1;

        // compensate scrolled horizontal size by reduction of vertical bar width if necessary
        // autoHidded scrollbars don't have an influence to layout
        if (this.vBar != null && this.autoHide === false &&
              (so.height > hh ||
              (so.width > ww && so.height > (hh - hps.height))))
        {
            maxH -= vps.width;
        }
        maxH = so.width > maxH ? (so.width - maxH) :  -1;

        var sy = sman.getSY(), sx = sman.getSX();
        if (this.vBar != null) {
            if (maxV < 0) {
                if (this.vBar.isVisible === true){
                    this.vBar.setVisible(false);
                    sman.scrollTo(sx, 0);
                    this.vBar.position.setOffset(0);
                }
                sy = 0;
            }
            else {
                this.vBar.setVisible(true);
            }
        }

        if (this.hBar != null){
            if (maxH < 0){
                if (this.hBar.isVisible === true){
                    this.hBar.setVisible(false);
                    sman.scrollTo(0, sy);
                    this.hBar.position.setOffset(0);
                }
            }
            else this.hBar.setVisible(true);
        }

        if (this.scrollObj.isVisible === true){
            this.scrollObj.setBounds(left, top,
                                      ww - (this.autoHide === false && this.vBar != null && this.vBar.isVisible === true ? vps.width  : 0),
                                      hh - (this.autoHide === false && this.hBar != null && this.hBar.isVisible === true ? hps.height : 0));
        }

        if (this.$interval === 0 && this.autoHide) {
            hps.height = vps.width = 0;
        }

        if (this.hBar != null && this.hBar.isVisible === true){
            this.hBar.setBounds(left, this.height - bottom - hps.height,
                                ww - (this.vBar != null && this.vBar.isVisible === true ? vps.width : 0),
                                hps.height);
            this.hBar.setMaximum(maxH);
        }

        if (this.vBar != null && this.vBar.isVisible === true){
            this.vBar.setBounds(this.width - right - vps.width, top,
                                vps.width,
                                hh -  (this.hBar != null && this.hBar.isVisible === true ? hps.height : 0));
            this.vBar.setMaximum(maxV);
        }
    };

    posChanged(target,prevOffset,prevLine,prevCol){
        if (this.$isPosChangedLocked === false) {

            //  show if necessary hidden scroll bar(s)
            if (this.autoHide === true) {
                // make sure autohide thread has not been initiated and make sure it makes sense
                // to initiate the thread (one of the scroll bar has to be visible)
                if (this.$interval === 0 && ((this.vBar != null && this.vBar.isVisible === true) ||
                                              (this.hBar != null && this.hBar.isVisible === true)    ))
                {
                    var $this = this;

                    // show scroll bar(s)
                    if (this.vBar != null) this.vBar.toFront();
                    if (this.hBar != null) this.hBar.toFront();
                    this.vrp();

                    // pointer move should keep scroll bars visible and pointer entered exited
                    // events have to be caught to track if pointer cursor is on a scroll
                    // bar. add temporary listeners
                    $this.$hiddingCounter = 2;
                    $this.$targetBar      = null;
                    var listener = pkg.events.bind({
                        pointerMoved: function(e) {
                            $this.$hiddingCounter = 1;
                        },

                        pointerExited: function(e) {
                            $this.$targetBar = null;
                        },

                        pointerEntered: function(e) {
                            if (e.source === $this.vBar) {
                                $this.$targetBar = $this.vBar;
                            }
                            else {
                                if (e.source === $this.hBar) {
                                    $this.$targetBar = $this.hBar;
                                    return;
                                }

                                $this.$targetBar = null;
                            }
                        }
                    });

                    // start thread to autohide shown scroll bar(s)
                    this.$interval = setInterval(function() {
                        if ($this.$hiddingCounter-- === 0 && $this.$targetBar == null) {
                            clearInterval($this.$interval);
                            $this.$interval = 0;
                            pkg.events.unbind(listener);
                            $this.doLayout();
                        }
                    }, 500);
                }
            }

            if (this.vBar != null && this.vBar.position === target) {
                this.scrollObj.scrollManager.scrollYTo(-this.vBar.position.offset);
            }
            else {
                if (this.hBar != null && this.hBar.position === target) {
                    this.scrollObj.scrollManager.scrollXTo(-this.hBar.position.offset);
                }
            }
        }
    };

    setIncrements(hUnit,hPage,vUnit,vPage) {
        if (this.hBar != null){
            if (hUnit !=  -1) this.hBar.unitIncrement = hUnit;
            if (hPage !=  -1) this.hBar.pageIncrement = hPage;
        }

        if (this.vBar != null){
            if (vUnit !=  -1) this.vBar.unitIncrement = vUnit;
            if (vPage !=  -1) this.vBar.pageIncrement = vPage;
        }
        return this;
    };


    // static

    insert(i,ctr,c) {
        if ("center" === ctr) {
            if (c.scrollManager == null) {
                c = new this.clazz.ContentPan(c);
            }

            this.scrollObj = c;
            c.scrollManager.bind(this);
        }
        else {
            if ("bottom" === ctr || "top" === ctr){
                this.hBar = c;
            }
            else {
                if ("left" === ctr || "right" === ctr) {
                    this.vBar = c;
                }
                else  {
                    throw new Error("Invalid constraints");
                }
            }

            // valid for scroll bar only
            if (c.incBt != null) c.incBt.setVisible(!this.autoHide);
            if (c.decBt != null) c.decBt.setVisible(!this.autoHide);
            c.position.bind(this);
        }

        return super.insert(i, ctr, c);
    }

    kidRemoved(index, comp){
        super.kidRemoved(index, comp);
        if (comp === this.scrollObj){
            this.scrollObj.scrollManager.unbind(this);
            this.scrollObj = null;
        }
        else {
            if (comp === this.hBar){
                this.hBar.position.unbind(this);
                this.hBar = null;
            }
            else {
                if (comp === this.vBar){
                    this.vBar.position.unbind(this);
                    this.vBar = null;
                }
            }
        }
    }
}