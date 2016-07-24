/**
 * View class that is designed as a basis for various reusable decorative
 * UI elements implementations
 * @class zebkit.ui.View
 */
class View {
    function $prototype() {
        this.gap = 2;

        /**
         * Get left gap. The method informs UI component that uses the view as
         * a border view how much space left side of the border occupies
         * @return {Integer} a left gap
         * @method getLeft
         */

         /**
          * Get right gap. The method informs UI component that uses the view as
          * a border view how much space right side of the border occupies
          * @return {Integer} a right gap
          * @method getRight
          */

         /**
          * Get top gap. The method informs UI component that uses the view as
          * a border view how much space top side of the border occupies
          * @return {Integer} a top gap
          * @method getTop
          */

         /**
          * Get bottom gap. The method informs UI component that uses the view as
          * a border view how much space bottom side of the border occupies
          * @return {Integer} a bottom gap
          * @method getBottom
          */
        this.getRight = this.getLeft = this.getBottom = this.getTop = function() {
            return this.gap;
        };

        /**
        * Return preferred size the view desires to have
        * @method getPreferredSize
        * @return {Object}
        */
        this.getPreferredSize = function() {
            return { width:0, height:0 };
        };

        /**
        * The method is called to render the decorative element on the
        * given surface of the specified UI component
        * @param {Canvas 2D context} g  graphical context
        * @param {Integer} x  x coordinate
        * @param {Integer} y  y coordinate
        * @param {Integer} w  required width
        * @param {Integer} h  required height
        * @param {zebkit.ui.Panel} c an UI component on which the view
        * element has to be drawn
        * @method paint
        */
        this.paint = function(g,x,y,w,h,c) {};
    }
}