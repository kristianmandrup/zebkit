/**
 * Focus manager class defines the strategy of focus traversing among
 * hierarchy of UI components. It keeps current focus owner component
 * and provides API to change current focus component
 * @class zebkit.ui.FocusManager
 * @extends {zebkit.ui.Manager}
 */
import { FOCUS_EVENT } from './events';
import Manager from './Manager';
import * as layout from '../../layout';

export default class FocusManager extends Manager {
    focusOwner: any;

    constructor() {
        super();
        /**
         * Reference to the current focus owner component.
         * @attribute focusOwner
         * @readOnly
         * @type {zebkit.ui.Panel}
         */
        this.focusOwner = null;
    }

    $freeFocus(comp) {
        if ( this.focusOwner != null &&
            (this.focusOwner === comp || layout.isAncestorOf(comp, this.focusOwner)))
        {
            this.requestFocus(null);
        }
    }

    /**
     * Component enabled event handler
     * @param  {zebkit.ui.Panel} c a component
     * @method compEnabled
     */
    compEnabled(e) {
        var c = e.source;
        if (c.isVisible === true && c.isEnabled === false && this.focusOwner != null) {
            this.$freeFocus(c);
        }
    }

    /**
     * Component shown event handler
     * @param  {zebkit.ui.Panel} c a component
     * @method compShown
     */
    compShown(e) {
        var c = e.source;
        if (c.isEnabled === true && c.isVisible === false && this.focusOwner != null) {
            this.$freeFocus(c);
        }
    }

    /**
     * Component removed event handler
     * @param  {zebkit.ui.Panel} p a parent
     * @param  {Integer} i      a removed component index
     * @param  {zebkit.ui.Panel} c a removed component
     * @method compRemoved
     */
    compRemoved(e) {
        var c = e.kid;
        if (c.isEnabled === true && c.isVisible === true && this.focusOwner != null) {
            this.$freeFocus(c);
        }
    }

    /**
     * Test if the given component is a focus owner
     * @param  {zebkit.ui.Panel} c an UI component to be tested
     * @method hasFocus
     * @return {Boolean} true if the given component holds focus
     */
    hasFocus(c) {
        return this.focusOwner === c;
    }

    /**
     * Key pressed event handler.
     * @param  {zebkit.ui.KeyEvent} e a key event
     * @method keyPressed
     */
    keyPressed(e){
        if (pkg.KeyEvent.TAB === e.code) {
            var cc = this.ff(e.source, e.shiftKey ?  -1 : 1);
            if (cc != null) {

                // TODO: WEB specific code has to be removed moved to another place
                if (document.activeElement != cc.getCanvas().element) {
                    cc.getCanvas().element.focus();
                    this.requestFocus(cc);
                } else {
                    this.requestFocus(cc);
                }
            }

            return true;
        }
    }

    findFocusable(c) {
        return (this.isFocusable(c) ? c : this.fd(c, 0, 1));
    }

    /**
     * Test if the given component can catch focus
     * @param  {zebkit.ui.Panel} c an UI component to be tested
     * @method isFocusable
     * @return {Boolean} true if the given component can catch a focus
     */
    isFocusable(c) {
        var d = c.getCanvas();
        if (d != null &&
                (c.canHaveFocus === true ||
                  (typeof c.canHaveFocus == "function" && c.canHaveFocus() === true)))
        {
            for(;c !== d && c != null; c = c.parent) {
                if (c.isVisible === false || c.isEnabled === false) {
                    return false;
                }
            }
            return c === d;
        }

        return false;
    }

    // looking recursively a focusable component among children components of
    // the given target  starting from the specified by index kid with the
    // given direction (forward or backward lookup)
    fd(t,index,d) {
        if (t.kids.length > 0){
            var isNComposite = t.catchInput == null || t.catchInput === false;
            for(var i = index; i >= 0 && i < t.kids.length; i += d) {
                var cc = t.kids[i];

                // check if the current children component satisfies
                // conditions it can grab focus or any deeper in hierarchy
                // component that can grab the focus exist
                if (cc.isEnabled === true                                           &&
                    cc.isVisible === true                                           &&
                    cc.width      >  0                                              &&
                    cc.height     >  0                                              &&
                    (isNComposite || (t.catchInput !== true      &&
                                      t.catchInput(cc) === false)  )                &&
                    ( (cc.canHaveFocus === true || (cc.canHaveFocus !=  null  &&
                                                    cc.canHaveFocus !== false &&
                                                    cc.canHaveFocus())            ) ||
                      (cc = this.fd(cc, d > 0 ? 0 : cc.kids.length - 1, d)) != null)  )
                {
                    return cc;
                }
            }
        }

        return null;
    }

    // find next focusable component
    // c - component starting from that a next focusable component has to be found
    // d - a direction of next focusable component lookup: 1 (forward) or -1 (backward)
    ff(c, d){
        var top = c;
        while (top != null && top.getFocusRoot == null) {
            top = top.parent;
        }

        if (top == null) {
            return null;
        }

        top = top.getFocusRoot();
        if (top == null) {
            return null;
        }

        if (top.traverseFocus != null) {
            return top.traverseFocus(c, d);
        }

        for(var index = (d > 0) ? 0 : c.kids.length - 1; c != top.parent; ){
            var cc = this.fd(c, index, d);
            if (cc != null) return cc;
            cc = c;
            c = c.parent;
            if (c != null) index = d + c.indexOf(cc);
        }

        return this.fd(top, d > 0 ? 0 : top.kids.length - 1, d);
    }

    /**
     * Force to pass a focus to the given UI component
     * @param  {zebkit.ui.Panel} c an UI component to pass a focus
     * @method requestFocus
     */
    requestFocus(c) {
        if (c != this.focusOwner && (c == null || this.isFocusable(c))) {
            var oldFocusOwner = this.focusOwner;
            if (c != null) {
                var nf = c.getEventDestination();
                if (nf == null || oldFocusOwner == nf) return;
                this.focusOwner = nf;
            } else {
                this.focusOwner = c;
            }

            if (oldFocusOwner != null) {
                var ofc = oldFocusOwner.getCanvas();
                FOCUS_EVENT.source  = oldFocusOwner;
                FOCUS_EVENT.related = this.focusOwner;
                oldFocusOwner.focused();
                pkg.events.fireEvent("focusLost", FOCUS_EVENT);
            }

            if (this.focusOwner != null) {
                FOCUS_EVENT.source  = this.focusOwner;
                FOCUS_EVENT.related = oldFocusOwner;
                this.focusOwner.focused();
                pkg.events.fireEvent("focusGained", FOCUS_EVENT);
            }

            return this.focusOwner;
        }
        return null;
    }

    /**
     * Pointer pressed event handler.
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerPressed
     */
    pointerPressed(e){
        if (e.isAction()) {
            // TODO: WEB specific code that has to be moved to another place
            // the problem is a target canvas element get mouse pressed
            // event earlier than it gets focus what is inconsistent behavior
            // to fix it a timer is used
            if (document.activeElement !== e.source.getCanvas().element) {
                var $this = this;
                setTimeout(function() {
                    $this.requestFocus(e.source);
                }, 50);
            } else {
                this.requestFocus(e.source);
            }
        }
    }
}
