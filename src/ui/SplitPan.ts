/**
 * Splitter panel UI component class. The component splits its area horizontally or vertically into two areas.
 * Every area hosts an UI component. A size of the parts can be controlled by pointer cursor dragging. Gripper
 * element is children UI component that can be customized. For instance:

      // create split panel
      var sp = new zebkit.ui.SplitPan(new zebkit.ui.Label("Left panel"),
                                    new zebkit.ui.Label("Right panel"));

      // customize gripper background color depending on its state
      sp.gripper.setBackground(new zebkit.ui.ViewSet({
           "over" : "yellow"
           "out" : null,
           "pressed.over" : "red"
      }));


 * @param {zebkit.ui.Panel} [first] a first UI component in splitter panel
 * @param {zebkit.ui.Panel} [second] a second UI component in splitter panel
 * @param {String} [o] an orientation of splitter element: "vertical" or "horizontal"
 * @class zebkit.ui.SplitPan
 * @constructor
 * @extends {zebkit.ui.Panel}
 */
export default class SplitPan extends Panel {
    $clazz() {
        this.Bar = Class(pkg.EvStatePan, [
            function $prototype() {
                this.prevLoc = 0;

                this.pointerDragged = function(e){
                    var x = this.x + e.x, y = this.y + e.y;
                    if (this.target.orient === "vertical"){
                        if (this.prevLoc != x){
                            x = this.target.normalizeBarLoc(x);
                            if (x > 0){
                                this.prevLoc = x;
                                this.target.setGripperLoc(x);
                            }
                        }
                    } else {
                        if (this.prevLoc != y) {
                            y = this.target.normalizeBarLoc(y);
                            if (y > 0){
                                this.prevLoc = y;
                                this.target.setGripperLoc(y);
                            }
                        }
                    }
                };

                this.pointerDragStarted = function (e){
                    var x = this.x + e.x, y = this.y + e.y;
                    if (e.isAction()) {
                        if (this.target.orient === "vertical"){
                            x = this.target.normalizeBarLoc(x);
                            if (x > 0) this.prevLoc = x;
                        } else {
                            y = this.target.normalizeBarLoc(y);
                            if (y > 0) this.prevLoc = y;
                        }
                    }
                };

                this.pointerDragEnded = function(e){
                    var xy = this.target.normalizeBarLoc(this.target.orient === "vertical" ? this.x + e.x
                                                                                           : this.y + e.y);
                    if (xy > 0) this.target.setGripperLoc(xy);
                };

                this.getCursorType = function(t, x, y) {
                    return (this.target.orient === "vertical" ? pkg.Cursor.W_RESIZE
                                                              : pkg.Cursor.N_RESIZE);
                };
            },

            function(target) {
                this.target = target;
                this.$super();
            }
        ]);
    }

    constructor(f,s,o) {
        super();        
        /**
         * A minimal size of the left (or top) sizable panel
         * @attribute leftMinSize
         * @type {Integer}
         * @readOnly
         * @default 50
         */

        /**
         * A minimal size of right (or bottom) sizable panel
         * @attribute rightMinSize
         * @type {Integer}
         * @readOnly
         * @default 50
         */

        /**
         * Indicates if the splitter bar can be moved
         * @attribute isMoveable
         * @type {Boolean}
         * @readOnly
         * @default true
         */

        /**
         * A gap between gripper element and first and second UI components
         * @attribute gap
         * @type {Integer}
         * @readOnly
         * @default 1
         */

        /**
         * A reference to gripper UI component
         * @attribute gripper
         * @type {zebkit.ui.Panel}
         * @readOnly
         */

        /**
         * A reference to left (top) sizable UI component
         * @attribute leftComp
         * @type {zebkit.ui.Panel}
         * @readOnly
         */

        /**
         * A reference to right (bottom) sizable UI component
         * @attribute rightComp
         * @type {zebkit.ui.Panel}
         * @readOnly
         */

        this.leftMinSize = this.rightMinSize = 50;
        this.isMoveable = true;
        this.gap = 1;
        this.orient = "vertical";

        this.minXY = this.maxXY = 0;
        this.barLocation = 70;
        this.leftComp = this.rightComp = this.gripper = null;

        if (arguments.length > 2) {
            this.orient = o;
        }

        if (f != null) this.add("left", f);
        if (s != null) this.add("right", s);
        this.add("center", new this.clazz.Bar(this));        
    }

    normalizeBarLoc(xy){
        if (xy < this.minXY) xy = this.minXY;
        else {
            if (xy > this.maxXY) xy = this.maxXY;
        }
        return (xy > this.maxXY || xy < this.minXY) ?  -1 : xy;
    }

    setOrientation(o) {
        if (o !== this.orient) {
            this.orient = zebkit.util.$validateValue(o, "horizontal", "vertical");
            this.vrp();
        }
        return this;
    }

    /**
     * Set gripper element location
     * @param  {Integer} l a location of the gripper element
     * @method setGripperLoc
     * @chainable
     */
    setGripperLoc(l){
        if (l != this.barLocation){
            this.barLocation = l;
            this.vrp();
        }
        return this;
    }

    calcPreferredSize(c){
        var fSize = pkg.$getPS(this.leftComp),
            sSize = pkg.$getPS(this.rightComp),
            bSize = pkg.$getPS(this.gripper);

        if (this.orient === "horizontal"){
            bSize.width = Math.max(((fSize.width > sSize.width) ? fSize.width : sSize.width), bSize.width);
            bSize.height = fSize.height + sSize.height + bSize.height + 2 * this.gap;
        }
        else {
            bSize.width = fSize.width + sSize.width + bSize.width + 2 * this.gap;
            bSize.height = Math.max(((fSize.height > sSize.height) ? fSize.height : sSize.height), bSize.height);
        }
        return bSize;
    }

    doLayout(target){
        var right  = this.getRight(),
            top    = this.getTop(),
            bottom = this.getBottom(),
            left   = this.getLeft(),
            bSize  = pkg.$getPS(this.gripper);

        if (this.orient === "horizontal"){
            var w = this.width - left - right;
            if (this.barLocation < top) this.barLocation = top;
            else {
                if (this.barLocation > this.height - bottom - bSize.height) {
                    this.barLocation = this.height - bottom - bSize.height;
                }
            }

            if (this.gripper != null){
                if (this.isMoveable){
                    this.gripper.setBounds(left, this.barLocation, w, bSize.height);
                }
                else {
                    this.gripper.toPreferredSize();
                    this.gripper.setLocation(Math.floor((w - bSize.width) / 2), this.barLocation);
                }
            }
            if (this.leftComp != null){
                this.leftComp.setBounds(left, top, w, this.barLocation - this.gap - top);
            }
            if (this.rightComp != null){
                this.rightComp.setLocation(left, this.barLocation + bSize.height + this.gap);
                this.rightComp.setSize(w, this.height - this.rightComp.y - bottom);
            }
        }
        else {
            var h = this.height - top - bottom;
            if (this.barLocation < left) this.barLocation = left;
            else {
                if (this.barLocation > this.width - right - bSize.width) {
                    this.barLocation = this.width - right - bSize.width;
                }
            }

            if (this.gripper != null){
                if(this.isMoveable === true){
                    this.gripper.setBounds(this.barLocation, top, bSize.width, h);
                }
                else{
                    this.gripper.setBounds(this.barLocation, Math.floor((h - bSize.height) / 2),
                                            bSize.width, bSize.height);
                }
            }

            if (this.leftComp != null){
                this.leftComp.setBounds(left, top, this.barLocation - left - this.gap, h);
            }

            if (this.rightComp != null){
                this.rightComp.setLocation(this.barLocation + bSize.width + this.gap, top);
                this.rightComp.setSize(this.width - this.rightComp.x - right, h);
            }
        }
    }

    /**
     * Set gap between gripper element and sizable panels
     * @param  {Integer} g a gap
     * @method setGap
     */
    setGap(g){
        if (this.gap != g){
            this.gap = g;
            this.vrp();
        }
        return this;
    }

    /**
     * Set the minimal size of the left (or top) sizeable panel
     * @param  {Integer} m  a minimal possible size
     * @method setLeftMinSize
     */
    setLeftMinSize(m){
        if (this.leftMinSize != m){
            this.leftMinSize = m;
            this.vrp();
        }
        return this;
    }

    /**
     * Set the minimal size of the right (or bottom) sizeable panel
     * @param  {Integer} m  a minimal possible size
     * @method setRightMinSize
     */
    setRightMinSize(m){
        if (this.rightMinSize != m){
            this.rightMinSize = m;
            this.vrp();
        }
        return this;
    }

    /**
     * Set the given gripper movable state
     * @param  {Boolean} b the gripper movable state.
     * @method setGripperMovable
     */
    setGripperMovable(b){
        if (b != this.isMoveable){
            this.isMoveable = b;
            this.vrp();
        }
        return this;
    }

    // static

    kidAdded(index,ctr,c){
        super.kidAdded(index, ctr, c);

        if ((ctr == null && this.leftComp == null) || "left" === ctr) {
            this.leftComp = c;
        }
        else {
            if ((ctr == null && this.rightComp == null) || "right" === ctr) {
                this.rightComp = c;
            }
            else {
                if ("center" === ctr) this.gripper = c;
                else throw new Error("" + ctr);
            }
        }
    }

    kidRemoved(index,c){
        super.kidRemoved(index, c);
        if (c === this.leftComp) this.leftComp = null;
        else {
            if (c === this.rightComp) {
                this.rightComp = null;
            }
            else {
                if (c === this.gripper) this.gripper = null;
            }
        }
    }

    resized(pw,ph) {
        var ps = this.gripper.getPreferredSize();
        if (this.orient === "vertical"){
            this.minXY = this.getLeft() + this.gap + this.leftMinSize;
            this.maxXY = this.width - this.gap - this.rightMinSize - ps.width - this.getRight();
        }
        else {
            this.minXY = this.getTop() + this.gap + this.leftMinSize;
            this.maxXY = this.height - this.gap - this.rightMinSize - ps.height - this.getBottom();
        }
        super.resized(pw, ph);
    }
}
