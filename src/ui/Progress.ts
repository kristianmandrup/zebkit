/**
 * Progress bar UI component class.                                                                                                                                                                                                                           y -= (bundleSize + this.gap   [description]
 * @class zebkit.ui.Progress
 * @constructor
 * @extends {zebkit.ui.Panel}
 */

/**
 * Fired when a progress bar value has been updated

        progress.bind(function(src, oldValue) {
            ...
        });

 *  @event fired
 *  @param {zebkit.ui.Progress} src a progress bar that triggers
 *  the event
 *  @param {Integer} oldValue a progress bar previous value
 */
export default class Progress extends Panel {
    constructor() {
        super();
        /**
         * Gap between bundle elements
         * @default 2
         * @attribute gap
         * @type {Integer}
         * @readOnly
         */
        this.gap = 2;

        /**
         * Progress bar orientation
         * @default "horizontal"
         * @attribute orient
         * @type {String}
         * @readOnly
         */
        this.orient = "horizontal";

        /**
         * Progress bar value
         * @attribute value
         * @type {Integer}
         * @readOnly
         */
        this.value = 0;
        this.setBundleView("darkBlue");

        /**
         * Progress bar bundle width
         * @attribute bundleWidth
         * @type {Integer}
         * @readOnly
         * @default 6
         */

        /**
         * Progress bar bundle height
         * @attribute bundleHeight
         * @type {Integer}
         * @readOnly
         * @default 6
         */

        this.bundleWidth = this.bundleHeight = 6;

        /**
         * Progress bar maximal value
         * @attribute maxValue
         * @type {Integer}
         * @readOnly
         * @default 20
         */
        this.maxValue = 20;
        this._ = new zebkit.util.Listeners();
        this.$super();        
    }

    paint(g) {
        var left = this.getLeft(), right = this.getRight(),
            top = this.getTop(), bottom = this.getBottom(),
            rs = (this.orient === "horizontal") ? this.width - left - right
                                                : this.height - top - bottom,
            bundleSize = (this.orient === "horizontal") ? this.bundleWidth
                                                        : this.bundleHeight;

        if (rs >= bundleSize){
            var vLoc = Math.floor((rs * this.value) / this.maxValue),
                x = left, y = this.height - bottom, bundle = this.bundleView,
                wh = this.orient === "horizontal" ? this.height - top - bottom
                                                      : this.width - left - right;

            while(x < (vLoc + left) && this.height - vLoc - bottom < y){
                if(this.orient === "horizontal"){
                    bundle.paint(g, x, top, bundleSize, wh, this);
                    x += (bundleSize + this.gap);
                }
                else{
                    bundle.paint(g, left, y - bundleSize, wh, bundleSize, this);
                    y -= (bundleSize + this.gap);
                }
            }

            if (this.titleView != null){
                var ps = this.bundleView.getPreferredSize();
                this.titleView.paint(g, Math.floor((this.width  - ps.width ) / 2),
                                        Math.floor((this.height - ps.height) / 2),
                                        ps.width, ps.height, this);
            }
        }
    }

    calcPreferredSize(l){
        var bundleSize = (this.orient === "horizontal") ? this.bundleWidth
                                                              : this.bundleHeight,
            v1 = (this.maxValue * bundleSize) + (this.maxValue - 1) * this.gap,
            ps = this.bundleView.getPreferredSize();

        ps = (this.orient === "horizontal") ? {
                                                  width :v1,
                                                  height:(this.bundleHeight >= 0 ? this.bundleHeight
                                                                                : ps.height)
                                              }
                                            : {
                                                width:(this.bundleWidth >= 0 ? this.bundleWidth
                                                                              : ps.width),
                                                height: v1
                                              };
        if (this.titleView != null) {
            var tp = this.titleView.getPreferredSize();
            ps.width  = Math.max(ps.width, tp.width);
            ps.height = Math.max(ps.height, tp.height);
        }
        return ps;
    }

    // static

    /**
     * Set the progress bar orientation
     * @param {String} o an orientation: "vertical" or "horizontal"
     * @method setOrientation
     */
    setOrientation(o){
        if (o !== this.orient) {
            this.orient = zebkit.util.$validateValue(o, "horizontal", "vertical");
            this.vrp();
        }
        return this;
    }

    /**
     * Set maximal integer value the progress bar value can rich
     * @param {Integer} m a maximal value the progress bar value can rich
     * @method setMaxValue
     */
    setMaxValue(m){
        if (m != this.maxValue) {
            this.maxValue = m;
            this.setValue(this.value);
            this.vrp();
        }
        return this;
    }

    /**
     * Set the current progress bar value
     * @param {Integer} p a progress bar
     * @method setValue
     */
    setValue(p){
        p = p % (this.maxValue + 1);
        if (this.value != p){
            var old = this.value;
            this.value = p;
            this._.fired(this, old);
            this.repaint();
        }
        return this;
    }

    /**
     * Set the given gap between progress bar bundle elements
     * @param {Integer} g a gap
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
     * Set the progress bar bundle element view
     * @param {zebkit.ui.View} v a progress bar bundle view
     * @method setBundleView
     */
    setBundleView(v){
        if (this.bundleView != v){
            this.bundleView = pkg.$view(v);
            this.vrp();
        }
        return this;
    }

    /**
     * Set the progress bar bundle element size
     * @param {Integer} w a bundle element width
     * @param {Integer} h a bundle element height
     * @method setBundleSize
     */
    setBundleSize(w, h){
        if (w != this.bundleWidth && h != this.bundleHeight){
            this.bundleWidth  = w;
            this.bundleHeight = h;
            this.vrp();
        }
        return this;
    }
}
