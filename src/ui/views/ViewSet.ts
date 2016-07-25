import View from './View';
import CompositeView from './CompositeView';

/**
* ViewSet view. The view set is a special view container that includes
* number of views accessible by a key and allows only one view be active
* in a particular time. Active is view that has to be rendered. The view
* set can be used to store number of decorative elements where only one
* can be rendered depending from an UI component state.
* @param {Object} args object that represents views instances that have
* to be included in the ViewSet
* @constructor
* @class zebkit.ui.ViewSet
* @extends zebkit.ui.CompositeView
*/
export default class ViewSet extends CompositeView {
    views: {};
    activeView: View;

    constructor(args) {
        super();
        if (args == null) {
            throw new Error("" + args);
        }

        /**
         * Views set
         * @attribute views
         * @type Object
         * @default {}
         * @readOnly
        */
        this.views = {};

        /**
         * Active in the set view
         * @attribute activeView
         * @type View
         * @default null
         * @readOnly
        */
        this.activeView = null;

        for(var k in args) {
            this.views[k] = pkg.$view(args[k]);
            if (this.views[k] != null) this.$recalc(this.views[k]);
        }
        this.activate("*");        
    }

    paint(g,x,y,w,h,d) {
        if (this.activeView != null) {
            this.activeView.paint(g, x, y, w, h, d);
        }
    }

    /**
     * Activate the given view from the given set.
     * @param  {String} id a key of a view from the set to be activated. Pass
     * null to make current view to undefined state
     * @return {Boolean} true if new view has been activated, false otherwise
     * @method activate
     */
    activate(id) {
        var old = this.activeView;

        if (id == null) {
            return (this.activeView = null) != old;
        }

        if (typeof this.views[id] !== 'undefined') {
            return (this.activeView = this.views[id]) != old;
        }

        if (id.length > 1 && id[0] !== '*' && id[id.length-1] !== '*') {
            var i = id.indexOf('.');
            if (i > 0) {
                var k = id.substring(0, i + 1) + '*';
                if (typeof this.views[k] !== 'undefined') {
                    return (this.activeView = this.views[k]) != old;
                }

                k = "*" + id.substring(i);
                if (typeof this.views[k] !== 'undefined') {
                    return (this.activeView = this.views[k]) != old;
                }
            }
        }

        return typeof this.views["*"] !== 'undefined' ? (this.activeView = this.views["*"]) != old
                                                        : false;
    }

    iterate(f) {
        for(var k in this.views) {
            f.call(this, k, this.views[k]);
        }
    }
}