/**
 *  Border panel UI component class. The component renders titled border around the
 *  given  content UI component. Border title can be placed on top or
 *  bottom border line and aligned horizontally (left, center, right). Every
 *  zebkit UI component can be used as a border title element.
 *  @param {zebkit.ui.Panel|String} [title] a border panel title. Can be a
 *  string or any other UI component can be used as the border panel title
 *  @param {zebkit.ui.Panel} [content] a content UI component of the border
 *  panel
 *  @param {Integer} [constraints] a title constraints. The constraints gives
 *  a possibility to place border panel title in different places. Generally
 *  the title can be placed on the top or bottom part of the border panel.
 *  Also the title can be aligned horizontally.

         // create border panel with a title located at the
         // top and aligned at the canter
         var bp = new zebkit.ui.BorderPan("Title",
                                         new zebkit.ui.Panel(),
                                         "top", "center");


 *  @constructor
 *  @class zebkit.ui.BorderPan
 *  @extends {zebkit.ui.Panel}
 */
export default class BorderPan extends Panel {
    $clazz() {
        this.Label = Class(pkg.Label, []);
        this.ImageLabel = Class(pkg.ImageLabel, []);
        this.Checkbox = Class(pkg.Checkbox, []);
    }

    constructor(title, center, o, a) {
        super();
        /**
         * Vertical gap. Define top and bottom paddings between
         * border panel border and the border panel content
         * @attribute vGap
         * @type {Integer}
         * @readOnly
         * @default 0
         */

         /**
          * Horizontal gap. Define left and right paddings between
          * border panel border and the border panel content
          * @attribute hGap
          * @type {Integer}
          * @readOnly
          * @default 0
          */
        this.vGap = this.hGap = 2;

         /**
          * Border panel label indent
          * @type {Integer}
          * @attribute indent
          * @default 4
          */
        this.indent = 4;

        this.orient = "top";

        this.alignment = "left";
    
        if (arguments.length > 0) {
            title = pkg.$component(title, this);
        }

        if (arguments.lengh > 2) {
            this.orient = o;
        }

        if (arguments.lengh > 3) {
            this.alignment = a;
        }

        /**
         * Border panel label component
         * @attribute label
         * @type {zebkit.ui.Panel}
         * @readOnly
         */

        /**
         * Border panel label content component
         * @attribute content
         * @type {zebkit.ui.Panel}
         * @readOnly
         */
        this.label = this.content = null;

        this.$super();
        if (title  != null) this.add("caption", title);
        if (center != null) this.add("center", center);
        
    }
      /**
      * Get the border panel title info. The information
      * describes a rectangular area the title occupies, the
      * title location and alignment
      * @return {Object} a title info
      *
      *  {
      *      x: {Integer}, y: {Integer},
      *      width: {Integer}, height: {Integer},
      *      orient: {Integer}
      *  }
      *
      * @method getTitleInfo
      * @protected
      */
    getTitleInfo() {
        return (this.label != null) ? { x      : this.label.x,
                                        y      : this.label.y,
                                        width  : this.label.width,
                                        height : this.label.height,
                                        orient: this.orient }
                                    : null;
    }

    calcPreferredSize(target){
        var ps = this.content != null && this.content.isVisible === true ? this.content.getPreferredSize()
                                                                          : { width:0, height:0 };
        if (this.label != null && this.label.isVisible === true){
            var lps = this.label.getPreferredSize();
            ps.height += lps.height;
            ps.width = Math.max(ps.width, lps.width + this.indent);
        }
        ps.width  += (this.hGap * 2);
        ps.height += (this.vGap * 2);
        return ps;
    };

    doLayout(target){
        var h = 0,
            right  = this.getRight(),
            left   = this.getLeft(),
            top    = this.orient === "top"   ? this.top    : this.getTop(),
            bottom = this.orient === "bottom"? this.bottom : this.getBottom();

        if (this.label != null && this.label.isVisible === true){
            var ps = this.label.getPreferredSize();
            h = ps.height;
            this.label.setBounds((this.alignment === "left") ? left + this.indent
                                                              : ((this.alignment === "right") ? this.width - right - ps.width - this.indent
                                                                                                : Math.floor((this.width - ps.width) / 2)),
                                  (this.orient === "bottom") ? (this.height - bottom - ps.height) : top,
                                  ps.width, h);
        }

        if (this.content != null && this.content.isVisible === true){
            this.content.setBounds(left + this.hGap,
                                    (this.orient === "bottom" ? top : top + h) + this.vGap,
                                    this.width  - right - left - 2 * this.hGap,
                                    this.height - top - bottom - h - 2 * this.vGap);
        }
    }

    /**
     * Set vertical and horizontal paddings between the
     * border panel border and the content of the border
     * panel
     * @param {Integer} vg a top and bottom paddings
     * @param {Integer} hg a left and right paddings
     * @method setGaps
     * @chainable
     */
    setGaps(vg, hg){
        if (this.vGap !== vg || hg !== this.hGap){
            this.vGap = vg;
            this.hGap = hg;
            this.vrp();
        }
        return this;
    }

    setOrientation(o) {
        if (this.orient !== o) {
            this.orient = zebkit.util.$validateValue(o, "top", "bottom");
            this.vrp();
        }
        return this;
    }

    setAlignment(a) {
        if (this.alignment !== a) {
            this.alignment = zebkit.util.$validateValue(a, "left", "right", "center");
            this.vrp();
        }
        return this;
    }
    
    // static

    setBorder(br) {
        br = pkg.$view(br);
        if (zebkit.instanceOf(br, pkg.TitledBorder) === false) {
            br = new TitledBorder(br, "center");
        }
        return super.setBorder(br);
    }

    kidAdded(index,ctr,lw) {
        super.kidAdded(index, ctr, lw);
        if ((ctr == null && this.content == null) || "center" === ctr) {
            this.content = lw;
        } else if (this.label == null) {
            this.label = lw;
        }
    }

    kidRemoved(index,lw){
        super.kidRemoved(index, lw);
        if (lw === this.label) {
            this.label = null;
        } else if (this.content === lw) {
            this.content = null;
        }
    }

}
