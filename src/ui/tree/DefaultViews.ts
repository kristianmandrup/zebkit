/**
 * Default tree editor view provider
 * @class zebkit.ui.tree.DefViews
 * @constructor
 * @param {String} [color] the tree item text color
 * @param {String} [font] the tree item text font
 */
export default class DefViews {
    function $prototype() {
        /**
         * Get a view for the given model item of the UI tree component
         * @param  {zebkit.ui.tree.Tree} tree  a tree component
         * @param  {zebkit.data.Item} item a tree model element
         * @return {zebkit.ui.View}  a view to visualize the given tree data model element
         * @method  getView
         */
        this.getView = function (tree, item){
            if (item.value && item.value.paint != null) {
                return item.value;
            }
            this.render.setValue(item.value == null ? "<null>" : item.value);
            return this.render;
        };

        /**
         * Set the default view provider text render font
         * @param {zebkit.ui.Font} f a font
         * @method setFont
         */
        this.setFont = function(f) {
            this.render.setFont(f);
            return this;
        };

        /**
         * Set the default view provider text render color
         * @param {String} c a color
         * @method setColor
         */
        this.setColor = function(c) {
            this.render.setColor(c);
            return this;
        };

        this[''] = function(color, font) {
            /**
             * Default tree item render
             * @attribute render
             * @readOnly
             * @type {zebkit.ui.StringRender}
             */
            this.render = new ui.StringRender("");

            zebkit.properties(this, this.clazz);

            if (color != null) this.setColor(color);
            if (font  != null) this.setFont(font);
        };
    }
}
