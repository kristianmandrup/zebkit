/**
* Pattern render.
* @class zebkit.ui.Pattern
* @param {Image} [img] an image to be used as the pattern
* @constructor
* @extends zebkit.ui.Render
*/
pkg.Pattern = Class(pkg.Render, [
    function $prototype() {
        /**
         * Buffered pattern
         * @type {Pattern}
         * @protected
         * @attribute pattern
         * @readOnly
         */
        this.pattern = null;

        this.paint = function(g,x,y,w,h,d) {
            if (this.pattern == null) {
                this.pattern = g.createPattern(this.target, 'repeat');
            }
            g.beginPath();
            g.rect(x, y, w, h);
            g.closePath();
            g.fillStyle = this.pattern;
            g.fill();
        };

        this.targetWasChanged = function(o, n) {
            this.pattern = null;
        };
    }
]);