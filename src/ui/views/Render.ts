import View from './View';
/**
 * Render class extends "zebkit.ui.View" class with a notion
 * of target object. Render stores reference  to a target that
 * the render knows how to visualize. Basically Render is an
 * object visualizer. For instance, developer can implement
 * text, image and so other objects visualizers.
 * @param {Object} target a target object to be visualized
 * with the render
 * @constructor
 * @extends zebkit.ui.View
 * @class zebkit.ui.Render
 */
export default class Render extends View {
    constructor(public target?) {
        super();
        /**
         * Target object to be visualized
         * @attribute target
         * @default null
         * @readOnly
         * @type {Object}
         */
        this.target = null;
        
        this.setTarget(target);                
    }

    /**
     * Set the given target object. The method triggers
     * "targetWasChanged(oldTarget, newTarget)" execution if
     * the method is declared. Implement the method if you need
     * to track a target object updating.
     * @method setTarget
     * @param  {Object} o a target object to be visualized
     */
    setTarget(o) {
        if (this.target != o) {
            var old = this.target;
            this.target = o;
            if (this.targetWasChanged != null) {
                this.targetWasChanged(old, o);
            }
        }
    }
}
