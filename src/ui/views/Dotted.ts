/**
* Dotted border view
* @class zebkit.ui.Dotted
* @param {String} [c] the dotted border color
* @constructor
* @extends zebkit.ui.View
*/
class Dotted extends View {
    function $prototype() {
        /**
         * @attribute color
         * @readOnly
         * @type {String}
         * @default "black"
         */
        this.color = "black";

        this.paint = function(g,x,y,w,h,d){
            g.setColor(this.color);
            g.drawDottedRect(x, y, w, h);
        };

        this[''] = function (c){
            if (arguments.length > 0) this.color = c;
        };
    }
}