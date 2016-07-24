/**
 *  UI component render class. Renders the given target UI component
 *  on the given surface using the specified 2D context
 *  @param {zebkit.ui.Panel} [target] an UI component to be rendered
 *  @class zebkit.ui.CompRender
 *  @constructor
 *  @extends zebkit.ui.Render
 */
pkg.CompRender = Class(pkg.Render, [
    function $prototype() {
        /**
         * Get preferred size of the render. The method doesn't calculates
         * preferred size it simply calls the target component "getPreferredSize"
         * method.
         * @method getPreferredSize
         * @return {Object} a preferred size
         *
         *      {width:<Integer>, height: <Integer>}
         */
        this.getPreferredSize = function(){
            return this.target == null || this.target.isVisible === false ? { width:0, height:0 }
                                                                          : this.target.getPreferredSize();
        };

        this.paint = function(g,x,y,w,h,d){
            var c = this.target;
            if (c != null && c.isVisible) {
                var prevW = -1, prevH = 0, parent = null;
                if (w !== c.width || h !== c.height) {

                    if (c.getCanvas() != null) {
                        parent = c.parent;
                        c.parent = null;
                    }

                    prevW = c.width;
                    prevH = c.height;
                    c.setSize(w, h);
                }

                // validate should be done here since setSize can be called
                // above
                c.validate();
                g.translate(x, y);

                try {
                    c.paintComponent(g);
                } catch(e) {
                    if (parent !== null) {
                        c.parent = parent;
                    }
                    g.translate(-x, -y);
                    throw e;
                }
                g.translate(-x, -y);


                if (prevW >= 0){
                    c.setSize(prevW, prevH);
                    if (parent !== null) {
                        c.parent = parent;
                    }
                    c.validate();
                }
            }
        };
    }
]);
