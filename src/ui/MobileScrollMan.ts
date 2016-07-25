/**
 * Mobile scroll manager class. Implements inertial scrolling in zebkit mobile application.
 * @class zebkit.ui.MobileScrollMan
 * @extends zebkit.ui.Manager
 * @constructor
 */
export default class MobileScrollMan extends Manager {
    function $prototype() {
        this.$timer = this.identifier = this.target = null;

        /**
         * Define pointer drag started events handler.
         * @param  {zebkit.ui.PointerEvent} e a pointer event
         * @method pointerDragStarted
         */
        this.pointerDragStarted = function(e) {
            if (e.touchCounter === 1 && e.pointerType === "touch") {
                this.$identifier = e.identifier;
                this.$target     = e.source;

                // detect scrollable component
                while (this.$target != null && this.$target.doScroll == null) {
                    this.$target = this.$target.parent;
                }

                if (this.$target != null && this.$target.pointerDragged != null) {
                     this.$target = null;
                }
            }
        };

        /**
         * Define pointer dragged events handler.
         * @param  {zebkit.ui.PointerEvent} e a pointer event
         * @method pointerDragged
         */
        this.pointerDragged = function(e) {
            if (e.touchCounter   === 1            &&
                this.$target    !==  null         &&
                this.$identifier === e.identifier &&
                e.direction     !==  null            )
            {
                this.$target.doScroll(-e.dx, -e.dy, "touch");
            }
        };

        this.$taskMethod = function() {
            var bar = this.$target.vBar,
                o   = bar.position.offset;

            // this is linear function with angel 42. every next value will
            // be slightly lower prev. one. theoretically angel 45 should
            // bring to infinite scrolling :)
            this.$dt = Math.tan(42 * Math.PI / 180) * this.$dt;
            bar.position.setOffset(o - Math.round(this.$dt));
            this.$counter++;

            if (o === bar.position.offset) {
                this.$target = null;
                clearInterval(this.$timer);
                this.$timer = null;
            }
        };

        /**
         * Define pointer drag ended events handler.
         * @param  {zebkit.ui.PointerEvent} e a pointer event
         * @method pointerDragEnded
         */
        this.pointerDragEnded = function(e) {
            if (this.$target !== null &&
                this.$timer  === null  &&
                this.$identifier === e.identifier &&
                (e.direction === "bottom" || e.direction === "top") &&
                this.$target.vBar != null &&
                this.$target.vBar.isVisible &&
                e.dy !== 0)
            {
                this.$dt = 2 * e.dy;
                this.$counter = 0;
                var $this = this;
                this.$timer = setInterval(function() { $this.$taskMethod($this); } , 50);
            }
        };

        /**
         * Define pointer pressed events handler.
         * @param  {zebkit.ui.PointerEvent} e a pointer event
         * @method pointerPressed
         */
        this.pointerPressed = function(e) {
            if (this.$timer !== null) {
                clearInterval(this.$timer);
                this.$timer = null;
            }
            this.$target = null;
        };
    }
}