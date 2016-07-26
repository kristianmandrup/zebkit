import EvStatePan from './EvStatePan';
import ButtonRepeatMix from './ButtonRepeatMix';
import ArrowView from './views/ArrowView';
import Cursor from './core/Cursor';

// http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/

// import { mix } from '../utils';
// export default class ArrowButton extends mix(EvStatePan).with(ButtonRepeatMix)  {
export default class ArrowButton extends ButtonRepeatMix(EvStatePan)  {
    get clazz() {
        return {
            ArrowView: ArrowView
        }    
    }

    constructor(public direction: string = 'left') {
        super();

        this._ = new zebkit.util.Listeners();
        this.cursorType = Cursor.HAND;

        if (arguments.length > 0) {
            this.direction = zebkit.util.$validateValue(direction, "left", "right", "top", "bottom");
        }

        this.setView({
            "out"          : new this.clazz.ArrowView(this.direction, "black"),
            "over"         : new this.clazz.ArrowView(this.direction, "red"),
            "pressed.over" : new this.clazz.ArrowView(this.direction, "black"),
            "disabled"     : new this.clazz.ArrowView(this.direction, "lightGray")
        });
        this.syncState(this.state, this.state);

    }

    setArrowDirection(d) {
        this.iterateArrowViews(function(k, v) {
            if (v != null) v.direction = d;
        });
        this.repaint();
        return this;
    }

    setArrowSize(w, h) {
        if (h == null) h = w;
        this.iterateArrowViews(function(k, v) {
            if (v != null) {
                v.width  = w;
                v.height = h;
            }
        });
        this.vrp();
        return this;
    }

    setArrowColors(pressedColor, overColor, outColor) {
        var views = this.view.views;
        if (views.out != null) views.out.color  = outColor;
        if (views.over.color != null) views.over.color = overColor;
        if (views["pressed.over"] != null) views["pressed.over"].color = pressedColor;
        this.repaint();
        return this;
    }

    iterateArrowViews(callback) {
        var views = this.view.views;
        for(var k in views) {
            if (views.hasOwnProperty(k)) {
                callback.call(this, k, views[k]);
            }
        }
    }
}