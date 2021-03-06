/**
 *  Button UI component. Button is composite component whose look and feel can
 *  be easily customized:

        // create image button
        var button = new zebkit.ui.Button(new zebkit.ui.ImagePan("icon1.gif"));

        // create image + caption button
        var button = new zebkit.ui.Button(new zebkit.ui.ImageLabel("Caption", "icon1.gif"));

        // create multilines caption button
        var button = new zebkit.ui.Button("Line1\nLine2");


 *  @class  zebkit.ui.Button
 *  @constructor
 *  @param {String|zebkit.ui.Panel|zebkit.ui.View} [t] a button label.
 *  The label can be a simple text or an UI component.
 *  @extends zebkit.ui.CompositeEvStatePan
 */

/**
 * Fired when a button has been pressed

        var b = new zebkit.ui.Button("Test");
        b.bind(function (src) {
            ...
        });

 * Button can be adjusted in respect how it generates the pressed event. Event can be
 * triggered by pressed or clicked even. Also event can be generated periodically if
 * the button is kept in pressed state.
 * @event buttonPressed
 * @param {zebkit.ui.Button} src a button that has been pressed
 */

import {CompEvStatePan, ButtonRepeatMix, Label, ImageLabel} from './';
import ViewPan from './core/ViewPan';

class ViewPanX extends ViewPan {
    view: any;

    constructor(v) {
        super();
        this.setView(v);
    }

    setState(id) {
        if (this.view != null && this.view.activate != null) {
            this.activate(id);
        }
    }
}

function Clazz() {
    this.Label = Label;

    this.ViewPan = ViewPanX;

    this.ImageLabel = ImageLabel;
}

import { listen } from '../utils';

export default class Button extends ButtonRepeatMix(CompEvStatePan)  {
    canHaveFocus: boolean;
    
    get clazz() {
        return new Clazz();
    }

    constructor(t) {
        super();
        this._ = new listen.Listeners();

        if (t != null) {
            t = $component(t, this);
        }

        if (t != null) {
            this.add(t);
            this.setFocusAnchorComponent(t);
        }

        this.canHaveFocus = true;
    }
}