export default class ArrowButton extends EvStatePan, ButtonRepeatMix {
    function $clazz() {
        this.ArrowView = Class(pkg.ArrowView, []);
    },

    function $prototype() {
        this.direction = "left";

        this.setArrowDirection = function(d) {
            this.iterateArrowViews(function(k, v) {
                if (v != null) v.direction = d;
            });
            this.repaint();
            return this;
        };

        this.setArrowSize = function(w, h) {
            if (h == null) h = w;
            this.iterateArrowViews(function(k, v) {
                if (v != null) {
                    v.width  = w;
                    v.height = h;
                }
            });
            this.vrp();
            return this;
        };

        this.setArrowColors = function(pressedColor, overColor, outColor) {
            var views = this.view.views;
            if (views.out != null) views.out.color  = outColor;
            if (views.over.color != null) views.over.color = overColor;
            if (views["pressed.over"] != null) views["pressed.over"].color = pressedColor;
            this.repaint();
            return this;
        };

        this.iterateArrowViews = function(callback) {
            var views = this.view.views;
            for(var k in views) {
                if (views.hasOwnProperty(k)) {
                    callback.call(this, k, views[k]);
                }
            }
        };
    },

    function(direction) {
        this._ = new zebkit.util.Listeners();
        this.cursorType = pkg.Cursor.HAND;

        if (arguments.length > 0) {
            this.direction = zebkit.util.$validateValue(direction, "left", "right", "top", "bottom");
        }

        this.setView({
            "out"          : new this.clazz.ArrowView(this.direction, "black"),
            "over"         : new this.clazz.ArrowView(this.direction, "red"),
            "pressed.over" : new this.clazz.ArrowView(this.direction, "black"),
            "disabled"     : new this.clazz.ArrowView(this.direction, "lightGray")
        });
        this.$super();
        this.syncState(this.state, this.state);
    }
}