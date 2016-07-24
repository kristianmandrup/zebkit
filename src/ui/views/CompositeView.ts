/**
* Composite view. The view allows developers to combine number of
* views and renders its together.
* @class zebkit.ui.CompositeView
* @param {Arrayt|Object} [views] array of dictionary of views
* to be composed together
* @constructor
* @extends zebkit.ui.View
*/
pkg.CompositeView = Class(pkg.View, [
    function $prototype() {
        /**
         * Left padding
         * @readOnly
         * @private
         * @attribute left
         * @type {Integer}
         */

        /**
         * Right padding
         * @private
         * @readOnly
         * @attribute right
         * @type {Integer}
         */

        /**
         * Top padding
         * @private
         * @readOnly
         * @attribute top
         * @type {Integer}
         */

        /**
         * Bottom padding
         * @readOnly
         * @private
         * @attribute bottom
         * @type {Integer}
         */
        this.left = this.right = this.bottom = this.top = this.height = this.width = 0;

        this.getTop = function() {
            return this.top;
        };

        this.getLeft = function() {
            return this.left;
        };

        this.getBottom = function () {
            return this.bottom;
        };

        this.getRight = function () {
            return this.right;
        };

        this.getPreferredSize = function (){
            return { width:this.width, height:this.height};
        };

        this.$recalc = function(v) {
            var b = 0, ps = v.getPreferredSize();
            if (v.getLeft != null) {
                b = v.getLeft();
                if (b > this.left) this.left = b;
            }

            if (v.getRight != null) {
                b = v.getRight();
                if (b > this.right) this.right = b;
            }

            if (v.getTop != null) {
                b = v.getTop();
                if (b > this.top) this.top = b;
            }

            if (v.getBottom != null) {
                b = v.getBottom();
                if (b > this.bottom) this.bottom = b;
            }


            if (ps.width > this.width) this.width = ps.width;
            if (ps.height > this.height) this.height = ps.height;

            if (this.voutline == null && v.outline != null) {
                this.voutline = v;
            }
        };

        this.iterate = function(f) {
            for(var i = 0; i < this.views.length; i++) {
                f.call(this, i, this.views[i]);
            }
        };

        this.recalc = function() {
            this.left = this.right = this.bottom = this.top = this.height = this.width = 0;
            this.iterate(function(k, v) {
                this.$recalc(v);
            });
        };

        this.ownerChanged = function(o) {
            this.iterate(function(k, v) {
                if (v != null && v.ownerChanged != null) {
                    v.ownerChanged(o);
                }
            });
        };

        this.paint = function(g,x,y,w,h,d) {
            for(var i=0; i < this.views.length; i++) {
                this.views[i].paint(g, x, y, w, h, d);
            }
        };

        this.outline = function(g,x,y,w,h,d) {
            return this.voutline != null && this.voutline.outline(g,x,y,w,h,d);
        };

        this[''] = function() {
            this.views = [];
            var args = arguments.length === 1 ? arguments[0] : arguments;
            for(var i = 0; i < args.length; i++) {
                this.views[i] = pkg.$view(args[i]);
                this.$recalc(this.views[i]);
            }
        };
    }
]);
