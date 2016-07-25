/**
 * Composite event state panel
 * @constructor
 * @extends {zebkit.ui.EvStatePan}
 * @class  zebkit.ui.CompositeEvStatePan
 */
pkg.CompositeEvStatePan = Class(pkg.EvStatePan, [
    function $prototype() {
        /**
         * Indicates if the component can have focus
         * @attribute canHaveFocus
         * @readOnly
         * @type {Boolean}
         */
        this.canHaveFocus = true;


        this.catchInput = true;


        this.focusComponent = null;

        /**
         * Reference to an anchor focus marker component
         * @attribute focusMarkerView
         * @readOnly
         * @type {zebkit.ui.Panel}
         */
        this.focusMarkerView = null;

        this.paintOnTop = function(g){
            var fc = this.focusComponent;
            if (this.focusMarkerView != null && fc != null && this.hasFocus()) {
                this.focusMarkerView.paint(g, fc.x, fc.y, fc.width, fc.height, this);
            }
        };

        /**
         * Set the view that has to be rendered as focus marker
         * when the component gains focus.
         * @param  {String|zebkit.ui.View|Function} c a view.
         * The view can be a color or border string code or view
         * or an implementation of zebkit.ui.View "paint(g,x,y,w,h,t)"
         * method.
         * @method setFocusMarkerView
         */
        this.setFocusMarkerView = function (c){
            if (c != this.focusMarkerView){
                this.focusMarkerView = pkg.$view(c);
                this.repaint();
            }
            return this;
        };

        /**
         * Says if the component can hold focus or not
         * @param  {Boolean} b true if the component can gain focus
         * @method setCanHaveFocus
         */
        this.setCanHaveFocus = function(b){
            if (this.canHaveFocus != b){
                var fm = pkg.focusManager;
                if (b === false && fm.focusOwner === this) {
                    fm.requestFocus(null);
                }
                this.canHaveFocus = b;
            }
            return this;
        };

        /**
         * Set the specified children component to be used as
         * focus marker view anchor component. Anchor component
         * is a component over that the focus marker view is
         * painted.
         * @param  {zebkit.ui.Panel} c  an anchor component
         * @method setFocusAnchorComponent
         */
        this.setFocusAnchorComponent = function(c) {
            if (this.focusComponent != c) {
                if (c != null && this.kids.indexOf(c) < 0) {
                    throw new Error("Focus component doesn't exist");
                }
                this.focusComponent = c;
                this.repaint();
            }
            return this;
        };
    },

    function focused() {
        this.$super();
        this.repaint();
    },

    function kidRemoved(i,l){
        if (l === this.focusComponent) {
            this.focusComponent = null;
        }
        this.$super(i, l);
    }
]);