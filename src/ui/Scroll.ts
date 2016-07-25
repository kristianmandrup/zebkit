/**
 * Scroll bar UI component
 * @param {String} [t] orientation of the scroll bar components:

        "vertical" - vertical scroll bar
        "horizontal"- horizontal scroll bar

 * @class zebkit.ui.Scroll
 * @constructor
 * @extends {zebkit.ui.Panel}
 */

import Panel from './core/Panel';
import util from '../util';

export default class Scroll extends Panel, util.Position.Metric {
    $clazz = () => {
        this.isDragable = true;

        var SB = Class(pkg.ArrowButton, [
            function $prototype() {
                this.isFireByPress  = true;
                this.firePeriod     = 20;
            }
        ]);

        this.VIncButton = Class(SB, []);
        this.VDecButton = Class(SB, []);
        this.HIncButton = Class(SB, []);
        this.HDecButton = Class(SB, []);

        this.VBundle = Class(pkg.Panel, []);
        this.HBundle = Class(pkg.Panel, []);

        this.MIN_BUNDLE_SIZE = 16;
    }

    constructor(t) {
        super();
        /**
         * Maximal possible value
         * @attribute max
         * @type {Integer}
         * @readOnly
         * @default 100
         */
        this.extra = this.max  = 100;

        /**
         * Page increment value
         * @attribute pageIncrement
         * @type {Integer}
         * @readOnly
         * @default 20
         */
        this.pageIncrement = 20;

        /**
         * Unit increment value
         * @attribute unitIncrement
         * @type {Integer}
         * @readOnly
         * @default 5
         */
        this.unitIncrement = 5;


        this.orient = "vertical";
    
        if (arguments.length > 0) {
            if (t !== "vertical" && t !== "horizontal") {
                throw new Error("" + t + "(alignment)");
            }
            this.orient = t;
        }

        /**
         * Increment button
         * @attribute incBt
         * @type {zebkit.ui.Button}
         * @readOnly
         */

        /**
         * Decrement button
         * @attribute decBt
         * @type {zebkit.ui.Button}
         * @readOnly
         */

        /**
         * Scroll bar bundle component
         * @attribute bundle
         * @type {zebkit.ui.Panel}
         * @readOnly
         */

        this.incBt = this.decBt = this.bundle = this.position = null;
        this.bundleLoc = 0;
        this.startDragLoc = Number.MAX_VALUE;
        this.$super(this);

        var b = (this.orient === "vertical");
        this.add("center", b ? new pkg.Scroll.VBundle()    : new pkg.Scroll.HBundle());
        this.add("top"   , b ? new pkg.Scroll.VDecButton() : new pkg.Scroll.HDecButton());
        this.add("bottom", b ? new pkg.Scroll.VIncButton() : new pkg.Scroll.HIncButton());

        this.setPosition(new zebkit.util.SingleColPosition(this));        
    }

    /**
     * Evaluate if the given point is in scroll bar bundle element
     * @param  {Integer}  x a x location
     * @param  {Integer}  y a y location
     * @return {Boolean}   true if the point is located inside the
     * scroll bar bundle element
     * @method isInBundle
     */
    isInBundle(x,y){
        var bn = this.bundle;
        return (bn != null &&
                bn.isVisible === true &&
                bn.x <= x && bn.y <= y &&
                bn.x + bn.width > x &&
                bn.y + bn.height > y);
    }

    amount(){
        var db = this.decBt;
        return (this.orient === "vertical") ? this.incBt.y - db.y - db.height
                                          : this.incBt.x - db.x - db.width;
    }

    pixel2value(p) {
        var db = this.decBt;
        return (this.orient === "vertical") ? Math.floor((this.max * (p - db.y - db.height)) / (this.amount() - this.bundle.height))
                                          : Math.floor((this.max * (p - db.x - db.width )) / (this.amount() - this.bundle.width));
    }

    value2pixel(){
        var db = this.decBt, bn = this.bundle, off = this.position.offset;
        return (this.orient === "vertical") ? db.y + db.height +  Math.floor(((this.amount() - bn.height) * off) / this.max)
                                          : db.x + db.width  +  Math.floor(((this.amount() - bn.width) * off) / this.max);
    }


    /**
     * Define composite component catch input method
     * @param  {zebkit.ui.Panel} child a children component
     * @return {Boolean} true if the given children component has to be input events transparent
     * @method catchInput
     */
    catchInput(child){
        return child === this.bundle || (this.bundle.kids.length > 0 &&
                                          zebkit.layout.isAncestorOf(this.bundle, child));
    }

    posChanged(target,po,pl,pc){
        if (this.bundle != null) {
            if (this.orient === "horizontal") {
                this.bundle.setLocation(this.value2pixel(), this.getTop());
            }
            else {
                this.bundle.setLocation(this.getLeft(), this.value2pixel());
            }
        }
    }

    getLines(){ return this.max; };
    getLineSize(line){ return 1; };
    getMaxOffset(){ return this.max; };

    fired = function(src){
        this.position.setOffset(this.position.offset + ((src === this.incBt) ? this.unitIncrement
                                                                              : -this.unitIncrement));
    }

    /**
     * Define pointer dragged events handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerDragged
     */
    pointerDragged(e){
        if (Number.MAX_VALUE != this.startDragLoc) {
            this.position.setOffset(this.pixel2value(this.bundleLoc -
                                                      this.startDragLoc +
                                                      ((this.orient === "horizontal") ? e.x : e.y)));
        }
    }

    /**
     * Define pointer drag started  events handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerDragStarted
     */
    pointerDragStarted(e){
        if (this.isDragable === true && this.isInBundle(e.x, e.y)) {
            this.startDragLoc = this.orient === "horizontal" ? e.x : e.y;
            this.bundleLoc    = this.orient === "horizontal" ? this.bundle.x : this.bundle.y;
        }
    }

    /**
     * Define pointer drag ended events handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerDragEnded
     */
    pointerDragEnded(e) {
        this.startDragLoc = Number.MAX_VALUE;
    }

    /**
     * Define pointer clicked events handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerClicked
     */
    pointerClicked(e){
        if (this.isInBundle(e.x, e.y) === false && e.isAction()){
            var d = this.pageIncrement;
            if (this.orient === "vertical"){
                if (e.y < (this.bundle != null ? this.bundle.y : Math.floor(this.height / 2))) d =  -d;
            }
            else {
                if (e.x < (this.bundle != null ? this.bundle.x : Math.floor(this.width / 2))) d =  -d;
            }
            this.position.setOffset(this.position.offset + d);
        }
    }

    calcPreferredSize(target){
        var ps1 = pkg.$getPS(this.incBt),
            ps2 = pkg.$getPS(this.decBt),
            ps3 = pkg.$getPS(this.bundle);

        if (this.orient === "horizontal"){
            ps1.width += (ps2.width + ps3.width);
            ps1.height = Math.max((ps1.height > ps2.height ? ps1.height : ps2.height), ps3.height);
        }
        else {
            ps1.height += (ps2.height + ps3.height);
            ps1.width = Math.max((ps1.width > ps2.width ? ps1.width : ps2.width), ps3.width);
        }
        return ps1;
    };

    doLayout(target){
        var right  = this.getRight(),
            top    = this.getTop(),
            bottom = this.getBottom(),
            left   = this.getLeft(),
            ew     = this.width - left - right,
            eh     = this.height - top - bottom,
            b      = (this.orient === "horizontal"),
            ps1    = pkg.$getPS(this.decBt),
            ps2    = pkg.$getPS(this.incBt),
            minbs  = pkg.Scroll.MIN_BUNDLE_SIZE;

        this.decBt.setBounds(left, top, b ? ps1.width
                                          : ew,
                                        b ? eh
                                          : ps1.height);


        this.incBt.setBounds(b ? this.width - right - ps2.width : left,
                              b ? top : this.height - bottom - ps2.height,
                              b ? ps2.width : ew,
                              b ? eh : ps2.height);

        if (this.bundle != null && this.bundle.isVisible === true){
            var am = this.amount();
            if (am > minbs) {
                var bsize = Math.max(Math.min(Math.floor((this.extra * am) / this.max), am - minbs), minbs);
                this.bundle.setBounds(b ? this.value2pixel() : left,
                                      b ? top : this.value2pixel(),
                                      b ? bsize : ew,
                                      b ? eh : bsize);
            }
            else {
                this.bundle.setSize(0, 0);
            }
        }
    }

    /**
     * Set the specified maximum value of the scroll bar component
     * @param {Integer} m a maximum value
     * @method setMaximum
     */
    setMaximum(m){
        if (m != this.max) {
            this.max = m;
            if (this.position.offset > this.max) {
                this.position.setOffset(this.max);
            }
            this.vrp();
        }
        return this;
    }

    /**
     * Set the scroll bar value.
     * @param {Integer} v a scroll bar value.
     * @method setValue
     */
    setValue(v){
        this.position.setOffset(v);
    }

    setPosition(p){
        if (p != this.position){
            if (this.position != null) this.position.unbind(this);
            this.position = p;
            if (this.position != null){
                this.position.bind(this);
                this.position.setMetric(this);
                this.position.setOffset(0);
            }
        }
    }

    setExtraSize(e){
        if (e != this.extra){
            this.extra = e;
            this.vrp();
        }
    }


    // static

    kidAdded(index,ctr,lw){
        super.kidAdded(index, ctr, lw);

        if ("center" === ctr) this.bundle = lw;
        else {
            if ("bottom" === ctr) {
                this.incBt = lw;
                this.incBt.bind(this);
            }
            else {
                if ("top" === ctr) {
                    this.decBt = lw;
                    this.decBt.bind(this);
                }
                else throw new Error("Invalid constraints : " + ctr);
            }
        }
    }

    kidRemoved(index,lw){
        super.kidRemoved(index, lw);
        if (lw === this.bundle) this.bundle = null;
        else {
            if(lw === this.incBt){
                this.incBt.unbind(this);
                this.incBt = null;
            }
            else {
                if(lw === this.decBt){
                    this.decBt.unbind(this);
                    this.decBt = null;
                }
            }
        }
    }
}