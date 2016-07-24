/**
* Vertical or horizontal linear gradient view
* @param {String} startColor start color
* @param {String} endColor end color
* @param {String} [type] type of gradient
*  "vertical" or "horizontal"
* @constructor
* @class zebkit.ui.Gradient
* @extends zebkit.ui.View
*/
pkg.Gradient = Class(pkg.View, [
    function $prototype() {
        this.orient = "vertical";

        this[''] = function(){
            /**
             * Gradient orientation: vertical or horizontal
             * @attribute orient
             * @readOnly
             * @default "vertical"
             * @type {String}
             */

            /**
             * Gradient start and stop colors
             * @attribute colors
             * @readOnly
             * @type {Array}
             */

            this.colors = Array.prototype.slice.call(arguments, 0);
            if (arguments.length > 2) {
                this.orient = arguments[arguments.length-1];
                this.colors.pop();
            }
        };

        this.paint = function(g,x,y,w,h,dd){
            var d = (this.orient === "horizontal" ? [0,1]: [1,0]),
                x1 = x * d[1],
                y1 = y * d[0],
                x2 = (x + w - 1) * d[1],
                y2 = (y + h - 1) * d[0];

            if (this.gradient == null || this.gx1 != x1 ||
                this.gx2 != x2        || this.gy1 != y1 ||
                this.gy2 != y2                             )
            {
                this.gx1 = x1;
                this.gx2 = x2;
                this.gy1 = y1;
                this.gy2 = y2;

                this.gradient = g.createLinearGradient(x1, y1, x2, y2);
                for(var i = 0; i < this.colors.length; i++) {
                    this.gradient.addColorStop(i, this.colors[i].toString());
                }
            }

            g.fillStyle = this.gradient;
            g.fillRect(x, y, w, h);
        };
    }
]);
