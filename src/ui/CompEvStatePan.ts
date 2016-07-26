/**
 * Composite event state panel
 * @constructor
 * @extends {zebkit.ui.EvStatePan}
 * @class  zebkit.ui.CompositeEvStatePan
 */
import EvStatePan from './EvStatePan';
import Panel from './core/Panel'
import { focusManager, $view } from '../utils'; 

export default class CompositeEvStatePan extends EvStatePan {
    canHaveFocus: boolean;
    catchInput: boolean;
    focusComponent: boolean;
    focusMarkerView: Panel;

    constructor() {
        super();
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
    }

    paintOnTop(g) {
        var fc = this.focusComponent;
        if (this.focusMarkerView != null && fc != null && this.hasFocus()) {
            this.focusMarkerView.paint(g, fc.x, fc.y, fc.width, fc.height, this);
        }
    }

    /**
     * Set the view that has to be rendered as focus marker
     * when the component gains focus.
     * @param  {String|zebkit.ui.View|Function} c a view.
     * The view can be a color or border string code or view
     * or an implementation of zebkit.ui.View "paint(g,x,y,w,h,t)"
     * method.
     * @method setFocusMarkerView
     */
    setFocusMarkerView(c) {
        if (c != this.focusMarkerView){
            this.focusMarkerView = $view(c);
            this.repaint();
        }
        return this;
    }

    /**
     * Says if the component can hold focus or not
     * @param  {Boolean} b true if the component can gain focus
     * @method setCanHaveFocus
     */
    setCanHaveFocus(b) {
        if (this.canHaveFocus != b){
            var fm = focusManager;
            if (b === false && fm.focusOwner === this) {
                fm.requestFocus(null);
            }
            this.canHaveFocus = b;
        }
        return this;
    }

    /**
     * Set the specified children component to be used as
     * focus marker view anchor component. Anchor component
     * is a component over that the focus marker view is
     * painted.
     * @param  {zebkit.ui.Panel} c  an anchor component
     * @method setFocusAnchorComponent
     */
    setFocusAnchorComponent(c) {
        if (this.focusComponent != c) {
            if (c != null && this.kids.indexOf(c) < 0) {
                throw new Error("Focus component doesn't exist");
            }
            this.focusComponent = c;
            this.repaint();
        }
        return this;
    }

    // static

    focused() {
        super.focused();
        this.repaint();
    }

    kidRemoved(i,l) {
        if (l === this.focusComponent) {
            this.focusComponent = null;
        }
        super.kidRemoved(i, l);
    }
}