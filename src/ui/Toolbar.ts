
/**
 * Toolbar UI component. Handy way to place number of click able elements
 * @class zebkit.ui.Toolbar
 * @extends {zebkit.ui.Panel}
 */

/**
 * Fired when a toolbar element has been pressed

        var t = new zebkit.ui.Toolbar();

        // add three pressable icons
        t.addImage("icon1.jpg");
        t.addImage("icon2.jpg");
        t.addLine();
        t.addImage("ico3.jpg");

        // catch a toolbar icon has been pressed
        t.bind(function (src) {
            ...
        });

 * @event pressed
 * @param {zebkit.ui.Panel} src a toolbar element that has been pressed
 */


import ToolPan from './toolbar/ToolPan';
import { Panel, ImagePan } from './core';
import { listen, types } from '../utils';
import { Line, Checkbox, Radiobox } from './';

function Clazz() {
    this.ToolPan  = ToolPan; 
    this.ImagePan = ImagePan;
    this.Line     = Line;
    this.Checkbox = Checkbox;
    this.Radiobox = Radiobox;

    // TODO: combo is not available in  this module yet
    // ui + ui.list has to be combined as one package
    //this.Combo    = Class(pkg.Combo, []);
}


export default class Toolbar extends Panel {
    get clazz() {
        return new Clazz();
    }

    constructor() {
        super();
        this._ = new listen.Listeners();        
    }

    /**
     * Test if the given component is a decorative element
     * in the toolbar
     * @param  {zebkit.ui.Panel}  c a component
     * @return {Boolean} return true if the component is
     * decorative element of the toolbar
     * @method isDecorative
     * @protected
     */
    isDecorative(c){
        return types.instanceOf(c, EvStatePan) === false;
    }

    // static

    /**
     * Add a radio box as the toolbar element that belongs to the
     * given group and has the specified content component
     * @param {zebkit.ui.Group} g a radio group the radio box belongs
     * @param {zebkit.ui.Panel} c a content
     * @return {zebkit.ui.Panel} a component that has been added
     * @method addRadio
     */
    function addRadio(g,c) {
        var cbox = new this.clazz.Radiobox(c, g);
        cbox.setCanHaveFocus(false);
        return this.add(cbox);
    },

    /**
     * Add a check box as the toolbar element with the specified content
     * component
     * @param {zebkit.ui.Panel} c a content
     * @return {zebkit.ui.Panel} a component that has been added
     * @method addSwitcher
     */
    function addSwitcher(c){
        var cbox = new this.clazz.Checkbox(c);
        cbox.setCanHaveFocus(false);
        return this.add(cbox);
    },

    /**
     * Add an image as the toolbar element
     * @param {String|Image} img an image or a path to the image
     * @return {zebkit.ui.Panel} a component that has been added
     * @method addImage
     */
    function addImage(img) {
        this.validateMetric();
        return this.add(new this.clazz.ImagePan(img));
    },

    /**
     * Add line to the toolbar component. Line is a decorative ]
     * element that logically splits toolbar elements. Line as any
     * other decorative element doesn't fire event
     * @return {zebkit.ui.Panel} a component that has been added
     * @method addLine
     */
    function addLine(){
        var line = new this.clazz.Line();
        line.constraints = "stretch";
        return this.addDecorative(line);
    },

    /**
     * Add the given component as decorative element of the toolbar.
     * Decorative elements don't fire event and cannot be pressed
     * @param {zebkit.ui.Panel} c a component
     * @return {zebkit.ui.Panel} a component that has been added
     * @method addDecorative
     */
    function addDecorative(c){
        return this.$getSuper("insert").call(this, this.kids.length, null, c);
    },

    function insert(i,id,d){
        if (d === "-") {
            var line = new this.clazz.Line();
            line.constraints = "stretch";
            return this.$super(i, null, line);
        } else if (Array.isArray(d)) {
            d = new this.clazz.Combo(d);
        }
        return this.$super(i, id, new this.clazz.ToolPan(d));
    }
]);