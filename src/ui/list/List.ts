import BaseList from './BaseList';

/**
 * The class is list component implementation that visualizes zebkit.data.ListModel.
 * It is supposed the model can have any type of items. Visualization of the items
 * is customized by defining a view provider.
 *
 * The general use case:

        // create list component that contains three item
        var list = new zebkit.ui.List([
            "Item 1",
            "Item 2",
            "Item 3"
        ]);

        ...
        // add new item
        list.model.add("Item 4");

        ...
        // remove first item
        list.model.removeAt(0);


 * To customize list items views you can redefine item view provider as following:

        // suppose every model item is an array that contains two elements,
        // first element points to the item icon and the second element defines
        // the list item text
        var list = new zebkit.ui.List([
            [ "icon1.gif", "Caption 1" ],
            [ "icon2.gif", "Caption 1" ],
            [ "icon3.gif", "Caption 1" ]
        ]);

        // define new list item views provider that represents every
        // list model item as icon with a caption
        list.setViewProvider(new zebkit.ui.List.ViewProvider([
            function getView(target, value, i) {
                var caption = value[1];
                var icon    = value[0];
                return new zebkit.ui.CompRender(new zebkit.ui.ImageLabel(caption, icon));
            }
        ]));

 * @class  zebkit.ui.List
 * @extends zebkit.ui.BaseList
 * @constructor
 * @param {zebkit.data.ListModel|Array} [model] a list model that should be passed as an instance
 * of zebkit.data.ListModel or as an array.
 * @param {Boolean} [isComboMode] true if the list navigation has to be triggered by
 * pointer cursor moving
 */
class List extends BaseList {
    function $clazz() {
        /**
         * List view provider class. This implementation renders list item using string
         * render. If a list item is an instance of "zebkit.ui.View" class than it will
         * be rendered as the view.
         * @class zebkit.ui.List.ViewProvider
         * @constructor
         * @param {String|zebkit.ui.Font} [f] a font to render list item text
         * @param {String} [c] a color to render list item text
         */
        this.ViewProvider = Class([
            function $prototype() {
                this[''] = function(f, c) {
                    /**
                     * Reference to text render that is used to paint a list items
                     * @type {zebkit.ui.StringRender}
                     * @attribute text
                     * @readOnly
                     */

                    this.text = new pkg.StringRender("");
                    zebkit.properties(this, this.clazz);
                    if (f != null) this.text.setFont(f);
                    if (c != null) this.text.setColor(c);
                };


                this.setColor = function(c) {
                    this.text.setColor(c);
                };

                this.setFont = function(f) {
                    this.text.setFont(f);
                };

                /**
                 * Get a view for the given model data element of the
                 * specified list component
                 * @param  {zebkit.ui.List} target a list component
                 * @param  {Object} value  a data model value
                 * @param  {Integer} i  an item index
                 * @return {zebkit.ui.View}  a view to be used to render
                 * the given list component item
                 * @method getView
                 */
                this.getView = function(target, value, i) {
                    if (value != null && value.paint != null) return value;
                    this.text.setValue(value == null ? "<null>" : value.toString());
                    return this.text;
                };
            }
        ]);

        /**
         * @for zebkit.ui.List
         */
    },

    function $prototype() {
        /**
         * Extra list item side gaps
         * @type {Inetger}
         * @attribute gap
         * @default 2
         * @readOnly
         */
        this.gap = 2;

        /**
         * Set the left, right, top and bottom a list item paddings
         * @param {Integer} g a left, right, top and bottom a list item paddings
         * @method setItemGap
         */
        this.setItemGap = function(g){
            if (this.gap != g){
                this.gap = g;
                this.vrp();
            }
        };

        this.paint = function(g){
            this.vVisibility();
            if (this.firstVisible >= 0){
                var sx = this.scrollManager.getSX(),
                    sy = this.scrollManager.getSY();

                try {
                    g.translate(sx, sy);
                    var y        = this.firstVisibleY,
                        x        = this.getLeft(),
                        yy       = this.vArea.y + this.vArea.height - sy,
                        count    = this.model.count(),
                        dg       = this.gap * 2;

                    for(var i = this.firstVisible; i < count; i++){
                        if (i != this.selectedIndex && this.provider.getCellColor != null) {
                            var bc = this.provider.getCellColor(this, i);
                            if (bc != null) {
                                g.setColor(bc);
                                g.fillRect(x, y, this.width, this.heights[i]);
                            }
                        }

                        this.provider.getView(this, this.model.get(i), i).paint(g, x + this.gap, y + this.gap,
                            this.widths[i] - dg,
                            this.heights[i]- dg, this);

                        y += this.heights[i];
                        if (y > yy) break;
                    }

                    g.translate(-sx,  -sy);
                }
                catch(e) {
                    g.translate(-sx,  -sy);
                    throw e;
                }
            }
        };

        this.recalc = function(){
            this.psWidth_ = this.psHeight_ = 0;
            if (this.model != null) {
                var count = this.model.count();
                if (this.heights == null || this.heights.length != count) {
                    this.heights = Array(count);
                }

                if (this.widths  == null || this.widths.length  != count) {
                    this.widths = Array(count);
                }

                var provider = this.provider;
                if (provider != null) {
                    var dg = 2*this.gap;
                    for(var i = 0;i < count; i++){
                        var ps = provider.getView(this, this.model.get(i), i).getPreferredSize();
                        this.heights[i] = ps.height + dg;
                        this.widths [i] = ps.width  + dg;

                        if (this.widths[i] > this.psWidth_) {
                            this.psWidth_ = this.widths[i];
                        }
                        this.psHeight_ += this.heights[i];
                    }
                }
            }
        };

        this.calcPreferredSize = function(l){
            return { width : this.psWidth_,
                     height: this.psHeight_ };
        };

        this.vVisibility = function(){
            this.validate();
            var prev = this.vArea;
            this.vArea = pkg.$cvp(this, {});

            if (this.vArea == null) {
                this.firstVisible = -1;
                return;
            }

            if (this.visValid === false ||
                (prev == null || prev.x != this.vArea.x ||
                 prev.y != this.vArea.y || prev.width != this.vArea.width ||
                 prev.height != this.vArea.height))
            {
                var top = this.getTop();
                if (this.firstVisible >= 0){
                    var dy = this.scrollManager.getSY();
                    while (this.firstVisibleY + dy >= top && this.firstVisible > 0){
                        this.firstVisible--;
                        this.firstVisibleY -= this.heights[this.firstVisible];
                    }
                } else {
                    this.firstVisible  = 0;
                    this.firstVisibleY = top;
                }

                if (this.firstVisible >= 0){
                    var count = this.model == null ? 0 : this.model.count(), hh = this.height - this.getBottom();

                    for(; this.firstVisible < count; this.firstVisible++)
                    {
                        var y1 = this.firstVisibleY + this.scrollManager.getSY(),
                            y2 = y1 + this.heights[this.firstVisible] - 1;

                        if ((y1 >= top && y1 < hh) || (y2 >= top && y2 < hh) || (y1 < top && y2 >= hh)) {
                            break;
                        }

                        this.firstVisibleY += (this.heights[this.firstVisible]);
                    }

                    if (this.firstVisible >= count) this.firstVisible =  -1;
                }
                this.visValid = true;
            }
        };

        this.getItemLocation = function(index){
            this.validate();
            var y = this.getTop() + this.scrollManager.getSY();
            for(var i = 0;i < index; i++) {
                y += this.heights[i];
            }
            return { x:this.getLeft(), y : y };
        };

        this.getItemSize = function(i){
            this.validate();
            return { width:this.widths[i], height:this.heights[i] };
        };

        this.getItemIdxAt = function(x,y){
            this.vVisibility();
            if (this.vArea != null && this.firstVisible >= 0) {
                var yy    = this.firstVisibleY + this.scrollManager.getSY(),
                    hh    = this.height - this.getBottom(),
                    count = this.model.count();

                for(var i = this.firstVisible; i < count; i++) {
                    if (y >= yy && y < yy + this.heights[i]) {
                        return i;
                    }
                    yy += (this.heights[i]);
                    if (yy > hh) break;
                }
            }
            return  -1;
        };
    },

    function (m, b){
        /**
         * Index of the first visible list item
         * @readOnly
         * @attribute firstVisible
         * @type {Integer}
         * @private
         */
        this.firstVisible = -1;

        /**
         * Y coordinate of the first visible list item
         * @readOnly
         * @attribute firstVisibleY
         * @type {Integer}
         * @private
         */
        this.firstVisibleY = this.psWidth_ = this.psHeight_ = 0;
        this.heights = this.widths = this.vArea = null;

        /**
         * Internal flag to track list items visibility status. It is set
         * to false to trigger list items metrics and visibility recalculation
         * @attribute visValid
         * @type {Boolean}
         * @private
         */
        this.visValid = false;
        this.setViewProvider(new this.clazz.ViewProvider());
        this.$super(m, b);
    },

    function invalidate(){
        this.visValid = false;
        this.firstVisible = -1;
        this.$super();
    },


    function drawView(g,id,v,x,y,w,h) {
        this.$super(g, id, v, x, y, this.width - this.getRight() - x, h);
    },

    function catchScrolled(psx,psy){
        this.firstVisible = -1;
        this.visValid = false;
        this.$super(psx, psy);
    }
}
