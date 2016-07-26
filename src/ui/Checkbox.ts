/**
 * Check-box UI component. The component is a container that
 * consists from two other UI components:

    - Box component to keep checker indicator
    - Label component to paint label

 * Developers are free to customize the component as they want.
 * There is no limitation regarding how the box and label components
 * have to be laid out, which UI components have to be used as
 * the box or label components, etc. The check box extends state
 * panel component and re-map states  to own views IDs:

    - "on.out" - checked and pointer cursor is out
    - "off.out" - un-checked and pointer cursor is out
    - "don" - disabled and checked,
    - "doff" - disabled and un-checked ,
    - "on.over" - checked and pointer cursor is over
    - "off.over" - un-checked and pointer cursor is out

 *
 * Customize is quite similar to what explained for zebkit.ui.EvStatePan:
 *

        // create checkbox component
        var ch = new zebkit.ui.Checkbox("Checkbox");

        // change border when the component checked to green
        // otherwise set it to red
        ch.setBorder(new zebkit.ui.ViewSet({
            "off.*": new zebkit.ui.Border("red"),
            "on.*": new zebkit.ui.Border("green")
        }));

        // customize checker box children UI component to show
        // green for checked and red for un-cheked states
        ch.kids[0].setView(new zebkit.ui.ViewSet({
            "off.*": "red",
            "on.*": "green"
        }));
        // sync current state with new look and feel
        ch.syncState();

 * Listening checked event should be done by registering a
 * listener in the check box switch manager as follow:

        // create checkbox component
        var ch = new zebkit.ui.Checkbox("Checkbox");

        // register a checkbox listener
        ch.manager.bind(function(sm) {
            var s = sm.getValue();
            ...
        });

 * @class  zebkit.ui.Checkbox
 * @extends zebkit.ui.CompositeEvStatePan
 * @constructor
 * @param {String|zebkit.ui.Panel} [label] a label
 * @param {zebkit.ui.SwitchManager} [m] a switch manager
 */
import { StatePan, Label } from './';
import SwitchManager from './SwitchManager';
import { types } from '../utils';
import KeyEvent from './web/keys/KeyEvent';

// TODO: use mixin
export default class Checkbox extends CompositeEvStatePan, Switchable {
    get clazz() {
        return {
            /**
             * The box UI component class that is used by default with
             * the check box component.
             * @constructor
             * @class zebkit.ui.Checkbox.Box
             * @extends zebkit.ui.ViewPan
             */
            Box: StatePan,
            Label: Label
        }
    }

    constructor(c, m) {
        super();


        if (arguments.length < 2) {
            m = new SwitchManager();
        }

        if (types.isString(c)) {
            c = new this.clazz.Label(c);
        }

        /**
         * Reference to box component
         * @attribute box
         * @type {zebkit.ui.Panel}
         * @readOnly
         */
        this.box = new this.clazz.Box();
        this.add(this.box);

        if (c != null) {
            this.add(c);
            this.setFocusAnchorComponent(c);
        }

        this.setSwitchManager(m);
    }

    /**
     * Callback method that is called whenever a state of switch
     * manager has been updated.
     * @param  {Boolean} b a new state
     * @method switched
     */
    switched(b){
        this.stateUpdated(this.state, this.state);
    };

    /**
     * Map the specified state into its symbolic name.
     * @protected
     * @param  {Integer} state a state
     * @return {String} a symbolic name of the state
     * @method toViewId
     */
    toViewId(state){
        if (this.isEnabled === true) {
            if (this.getValue()) {
                return (this.state === OVER) ? "on.over" : "on.out";
            }
            return (this.state === OVER) ? "off.over" : "off.out";
        }
        return this.getValue() ? "don" : "doff";
    }

    // static

    keyPressed(e){
        if (types.instanceOf(this.manager, pkg.Group) && this.getValue()){
            var d = 0;
            if (e.code === KeyEvent.LEFT || e.code === KeyEvent.UP) d = -1;
            else {
                if (e.code === KeyEvent.RIGHT || e.code === KeyEvent.DOWN) d = 1;
            }

            if (d !== 0) {
                var p = this.parent;
                for(var i = p.indexOf(this) + d;i < p.kids.length && i >= 0; i += d){
                    var l = p.kids[i];
                    if (l.isVisible === true &&
                        l.isEnabled === true &&
                        types.instanceOf(l, Checkbox) &&
                        l.manager === this.manager      )
                    {
                        l.requestFocus();
                        l.setValue(true);
                        break;
                    }
                }
                return ;
            }
        }
        super.keyPressed(e);
    }

    stateUpdated(o, n) {
        if (o === PRESSED_OVER && n === OVER) {
            this.toggle();
        }
        super.stateUpdated(o, n);
    }

    kidRemoved(index,c) {
        if (this.box === c) {
            this.box = null;
        }
        super.kidRemoved(index,c);
    }
}