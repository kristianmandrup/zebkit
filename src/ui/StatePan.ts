/**
 * State panel class. The class is UI component that allows to customize
 * the component  face, background and border depending on the component
 * state. Number and names of states the component can have is defined
 * by developers. To bind a view to the specified state use zebkit.ui.ViewSet
 * class. For instance if a component has to support two states : "state1" and
 * "state2" you can do it as following:

        // create state component
        var p = new zebkit.ui.StatePan();

        // define border view that contains views for "state1" and "state2"
        p.setBorder({
            "state1": new zebkit.ui.Border("red", 1),
            "state1": new zebkit.ui.Border("blue", 2)

        });

        // define background view that contains views for "state1" and "state2"
        p.setBorder({
            "state1": "yellow",
            "state1": "green"
        });

        // set component state
        p.setState("state1");

 * State component children components can listening when the state of the component
 * has been updated by implementing "parentStateUpdated(o,n,id)" method. It gets old
 * state, new state and a view id that is mapped to the new state.  The feature is
 * useful if we are developing a composite components whose children component also
 * should react to a state changing.
 * @class  zebkit.ui.StatePan
 * @constructor
 * @extends {zebkit.ui.ViewPan}
 */
import ViewPan from './core/ViewPan';

export default class StatePan extends ViewPan {
    state: any;
    border: any;

    constructor() {
        super();
        /**
         * Current component state
         * @attribute state
         * @readOnly
         * @type {Object}
         */
        this.state = null;
    }
    /**
     * Set the component state
     * @param {Object} s a state
     * @method  setState
     */
    setState(s) {
        if (s !== this.state){
            var prev = this.state;
            this.state = s;
            this.stateUpdated(prev, s);
        }
    }

    /**
     * Define the method if the state value has to be
     * somehow converted to a view id. By default the state value
     * itself is used as a view id.
     * @param {Object} s a state to be converted
     * @return {String} a view ID
     * @method toViewId
     */

    /**
     * Called every time the component state has been updated
     * @param  {Integer} o a previous component state
     * @param  {Integer} n a new component state
     * @method stateUpdated
     */
    stateUpdated(o, n) {
        var b = false, id = (this.toViewId != null ? this.toViewId(n) : n);

        if (id != null) {
            for(var i = 0; i < this.kids.length; i++) {
                var kid = this.kids[i];
                if (kid.setState != null) {
                    kid.setState(id);
                }
            }

            if (this.border != null && this.border.activate != null) {
                b = this.border.activate(id) || b;
            }

            if (this.view != null && this.view.activate != null) {
                b = this.view.activate(id) || b;
            }

            if (this.bg != null && this.bg.activate != null) {
                b = this.bg.activate(id) || b;
            }

            if (b) {
                this.repaint();
            }
        }
    }

    /**
     * Refresh state
     * @protected
     * @method syncState
     */
    syncState() {
        this.stateUpdated(this.state, this.state);
    }

    setView(v) {
        if (v != this.view){
            super.setView(v);
            // check if the method called after constructor execution
            // otherwise sync is not possible
            if (this.kids != null) this.syncState(this.state, this.state);
        }
        return this;
    }

    setBorder(v) {
        if (v != this.border){
            super.setBorder(v);
            this.syncState(this.state, this.state);
        }
        return this;
    }

    setBackground(v){
        if (v != this.bg){
            super.setBackground(v);
            this.syncState(this.state, this.state);
        }
        return this;
    }
}
