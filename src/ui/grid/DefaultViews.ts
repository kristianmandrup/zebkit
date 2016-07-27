/**
 * Default grid cell views provider. The class rules how a grid cell content,
 * background has to be rendered and aligned. Developers can implement an own
 * views providers and than setup it for a grid by calling "setViewProvider(...)"
 * method.
 * @param {zebkit.ui.TextRender|zebkit.ui.StringText} [render] a string render
 * @class zebkit.ui.grid.DefViews
 * @constructor
 */
export default class DefViews {
    constructor(render) {
        /**
         * Default render that is used to paint grid content.
         * @type {zebkit.ui.StringRender}
         * @attribute render
         * @readOnly
         * @protected
         */
        this.render = (render == null ? new ui.StringRender("") : render);
        zebkit.properties(this, this.clazz);
    }

    /**
     * Set the default view provider text render font
     * @param {zebkit.ui.Font} f a font
     * @method setFont
     */
    setFont(f) {
        this.render.setFont(f);
        return this;
    }

    /**
     * Set the default view provider text render color
     * @param {String} c a color
     * @method setColor
     */
    setColor(c) {
        this.render.setColor(c);
        return this;
    }

    /**
     * Get a renderer to draw the specified grid model value.
     * @param  {zebkit.ui.grid.Grid} target a target Grid component
     * @param  {Integer} row  a grid cell row
     * @param  {Integer} col  a grid cell column
     * @param  {Object} obj   a model value for the given grid cell
     * @return {zebkit.ui.View}  an instance of  view to be used to
     * paint the given cell model value
     * @method  getView
     */
    getView(target, row, col, obj){
        if (obj != null) {
            if (obj.toView != null) return obj.toView();
            if (obj.paint != null) return obj;
            this.render.setValue(obj.toString());
            return this.render;
        }
        return null;
    }

    /**
     * Get an horizontal alignment a content in the given grid cell
     * has to be adjusted. The method is optional.
     * @param  {zebkit.ui.grid.Grid} target a target grid component
     * @param  {Integer} row   a grid cell row
     * @param  {Integer} col   a grid cell column
     * @return {String}  a horizontal alignment ("left", "center", "right")
     * @method  getXAlignment
     */

        /**
         * Get a vertical alignment a content in the given grid cell
        * has to be adjusted. The method is optional.
        * @param  {zebkit.ui.grid.Grid} target a target grid component
        * @param  {Integer} row   a grid cell row
        * @param  {Integer} col   a grid cell column
        * @return {String}  a vertical alignment ("top", "center", "bottom")
        * @method  getYAlignment
        */

        /**
         * Get the given grid cell color
        * @param  {zebkit.ui.grid.Grid} target a target grid component
        * @param  {Integer} row   a grid cell row
        * @param  {Integer} col   a grid cell column
        * @return {String}  a cell color to be applied to the given grid cell
        * @method  getCellColor
        */
}
