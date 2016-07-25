export class FocusEvent extends Event {
    constructor() {
        super();
        this.related = null;
    }
}

export class CompEvent extends Event {
    constructor() {
        super();
        this.kid = this.constraints = null;
        this.prevX = this.prevY = this.index = -1;
        this.prevWidth = this.prevHeight = -1;
    }
}

export const COMP_EVENT = new CompEvent();
export const FOCUS_EVENT = new FocusEvent();
export const SHORTCUT_EVENT = new Event();


import PointerEvent from './PointerEvent';

//
// Extend Pointer event with zebkit specific fields and methods
//
PointerEvent.extend([
    function $prototype() {
        /**
         * Absolute mouse pointer x coordinate
         * @attribute absX
         * @readOnly
         * @type {Integer}
         */
        this.absX = 0;

        /**
         * Absolute mouse pointer y coordinate
         * @attribute absY
         * @readOnly
         * @type {Integer}
         */
         this.absY = 0;

        /**
         * Mouse pointer x coordinate (relatively to source UI component)
         * @attribute x
         * @readOnly
         * @type {Integer}
         */
        this.x = 0;

        /**
         * Mouse pointer y coordinate (relatively to source UI component)
         * @attribute y
         * @readOnly
         * @type {Integer}
         */
        this.y = 0;

        /**
         * Reset the event properties with new values
         * @private
         * @param  {zebkit.ui.Panel} source  a source component that triggers the event
         * @param  {Integer} ax an absolute (relatively to a canvas where the source
         * component is hosted) x mouse cursor coordinate
         * @param  {Integer} ay an absolute (relatively to a canvas where the source
         * component is hosted) y mouse cursor coordinate
         * @method  updateCoordinates
         */
        this.update = function(source,ax,ay){
            // this can speed up calculation significantly check if source zebkit component
            // has not been changed, his location and parent component also has not been
            // changed than we can skip calculation of absolute location by traversing
            // parent hierarchy
            if (this.source        === source        &&
                this.source.parent === source.parent &&
                source.x           === this.$px      &&
                source.y           === this.$py         )
            {
                this.x += (ax - this.absX);
                this.y += (ay - this.absY);
                this.absX = ax;
                this.absY = ay;
                this.source = source;
            } else {
                this.source = source;
                this.absX = ax;
                this.absY = ay;

                // convert absolute location to relative location
                while (source.parent != null) {
                    ax -= source.x;
                    ay -= source.y;
                    source = source.parent;
                }
                this.x = ax;
                this.y = ay;
            }

            this.$px = source.x;
            this.$py = source.y;

            return this;
        };
    }
}

