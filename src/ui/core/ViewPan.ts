
/**
 *  UI component to keep and render the given "zebkit.ui.View" class
 *  instance. The target view defines the component preferred size
 *  and the component view.
 *  @class zebkit.ui.ViewPan
 *  @constructor
 *  @extends {zebkit.ui.Panel}
 */

import Panel from './Panel';

export default class ViewPan extends Panel {
    view: any;

    constructor() {
        super();
        /**
         * Reference to a view that the component visualize
         * @attribute view
         * @type {zebkit.ui.View}
         * @default null
         * @readOnly
         */
        this.view = null;
    }

    paint(g) {
        if (this.view !== null){
            var l = this.getLeft(),
                t = this.getTop();

            this.view.paint(g, l, t, this.width  - l - this.getRight(),
                                      this.height - t - this.getBottom(), this);
        }
    }

    /**
     * Set the target view to be wrapped with the UI component
     * @param  {zebkit.ui.View|Function} v a view or a rendering
     * view "paint(g,x,y,w,h,c)" function
     * @method setView
     * @chainable
     */
    setView(v) {
        var old = this.view;
        v = pkg.$view(v);

        if (v !== old) {
            this.view = v;
            this.notifyRender(old, v);
            this.vrp();
        }

        return this;
    }

    /**
     * Override the parent method to calculate preferred size
     * basing on a target view.
     * @param  {zebkit.ui.Panel} t [description]
     * @return {Object} return a target view preferred size if it is defined.
     * The returned structure is the following:
          { width: {Integer}, height:{Integer} }
      * @method  calcPreferredSize
      */
    calcPreferredSize(t) {
        return this.view !== null ? this.view.getPreferredSize() : { width:0, height:0 };
    }
}