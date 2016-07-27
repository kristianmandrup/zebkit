/**
 *  zCanvas zebkit UI component class. This is one of the key
 *  class everybody has to use to start building an UI. The class is a wrapper
 *  for HTML Canvas element. Internally it catches all native HTML Canvas
 *  events and translates its into Zebkit UI events.
 *
 *  zCanvas instantiation triggers a new HTML Canvas will be created
 *  and added to HTML DOM tree.  It happens if developer doesn't pass
 *  an HTML Canvas element reference or an ID of existing HTML Canvas
 *  element If developers need to re-use an existent in DOM tree canvas
 *  element they have to pass id of the canvas that has to be used as basis
 *  for zebkit UI creation or reference to a HTML Canvas element:

        // a new HTML canvas element is created and added into HTML DOM tree
        var canvas = zebkit.ui.zCanvas();

        // a new HTML canvas element is created into HTML DOM tree
        var canvas = zebkit.ui.zCanvas(400,500);  // pass canvas size

        // stick to existent HTML canvas element
        var canvas = zebkit.ui.zCanvas("ExistentCanvasID");

 *  The zCanvas has layered structure. Every layer is responsible for
 *  showing and controlling a dedicated type of UI elements like windows
 *  pop-up menus, tool tips and so on. Developers have to build an own UI
 *  hierarchy on the canvas root layer. The layer is standard UI panel
 *  that is accessible as zCanvas component instance "root" field.

        // create canvas
        var canvas = zebkit.ui.zCanvas(400,500);

        // save reference to canvas root layer where
        // hierarchy of UI components have to be hosted
        var root = canvas.root;

        // fill root with UI components
        var label = new zebkit.ui.Label("Label");
        label.setBounds(10,10,100,50);
        root.add(label);

 *  @class zebkit.ui.zCanvas
 *  @extends {zebkit.ui.Panel}
 *  @constructor
 *  @param {String|Canvas} [element] an ID of a HTML canvas element or
 *  reference to an HTML Canvas element.
 *  @param {Integer} [width] a width of an HTML canvas element
 *  @param {Integer} [height] a height of an HTML canvas element
 */

/**
 * Implement the event handler method  to catch canvas initialized event.
 * The event is triggered once the canvas has been initiated and all properties
 * listeners of the canvas are set upped. The event can be used to load
 * saved data.

     var p = new zebkit.ui.zCanvas(300, 300, [
          function canvasInitialized() {
              // do something
          }
     ]);

 * @event  canvasInitialized
 */



import HtmlElement from './HtmlElement';
import Panel from './Panel';
import * as web from '../../web';
import $ContextMethods from './ContextMethods';

export default class HtmlCanvas extends HtmlElement {
    $clazz = new $ContextMethods();

    $rotateValue: number;
    $scaleX: number;
    $scaleY: number;
    $paintTask: any;

    $da: {}; // Object
    $container: any;
    $context: any;

    width: number;
    height: number;
    element: any; // DOM element    

    // e is a DOM element
    constructor(e) {
        super(e == null ? "canvas" : e);

        this.$rotateValue = 0;
        this.$scaleX = 1;
        this.$scaleY = 1;

        this.$paintTask = null;
        
        if (e != null && (e.tagName == null || e.tagName != "CANVAS")) {
            throw new Error("Invalid element '" + e + "'");
        }

        /**
         * Keeps rectangular "dirty" area of the canvas component
         * @private
         * @attribute $da
         * @type {Object}
                { x:Integer, y:Integer, width:Integer, height:Integer }
         */
        this.$da = { x: 0, y: 0, width: -1, height: 0 };

        // let HTML Canvas be WEB event transparent
        this.$container.style["pointer-events"] = "none";

        // add class to canvas if this element has been created
        if (e == null) {
            // prevent canvas selection
            this.element.onselectstart = function() { return false; };
        }
    }

    // set border for canvas has to be set as zebkit border, since canvas
    // is DOM component designed for rendering, so setting DOM border
    // doesn't allow us to render zebkit border
    setBorder(b) {
        return Panel.prototype.setBorder.call(this, b);
    }

    rotate(r) {
        this.$rotateValue += r;
        if (this.$context != null) {
            this.$context.rotate(r);
        }

        this.vrp();
        return this;
    }

    scale(sx, sy) {
        if (this.$context != null) this.$context.scale(sx, sy);
        this.$scaleX = this.$scaleX * sx;
        this.$scaleY = this.$scaleY * sy;
        this.vrp();
        return this;
    }

    clearTransformations() {
        this.$scaleX = 1;
        this.$scaleY = 1;
        this.$rotateValue = 0;
        if (this.$context != null) {
            this.$context = web.$canvas(this.element, this.width, this.height, true);
            this.$context.reset(this.width, this.height);
        }
        this.vrp();
        return this;
    }

    // set passing for canvas has to be set as zebkit padding, since canvas
    // is DOM component designed for rendering, so setting DOM padding
    // doesn't allow us to hold painting area proper
    setPadding() {
        return Panel.prototype.setPadding.apply(this, arguments);
    }

    setSize(w, h) {
        if (this.width != w || h != this.height) {
            var pw  = this.width,
                ph  = this.height;

            this.$context = web.$canvas(this.element, w, h);

            // canvas has one instance of context, the code below
            // test if the context has been already full filled
            // with necessary methods and if it is not true
            // fill it
            if (typeof this.$context.$states === "undefined") {
                web.$extendContext(this.$context, this.clazz.$ContextMethods);
            }

            this.$context.reset(w, h);

            // if canvas has been rotated apply the rotation to the context
            if (this.$rotateValue !== 0) {
                this.$context.rotate(this.$rotateValue);
            }

            // if canvas has been scaled apply it to it
            if (this.$scaleX !== 1 || this.$scaleY !== 1) {
                this.$context.scale(this.$scaleX, this.$scaleY);
            }

            this.width  = w;
            this.height = h;

            this.invalidate();

            // TODO: think to replace it with vrp()
            this.validate();
            this.repaint();

            if (w != pw || h != ph) {
                this.resized(pw, ph);
            }
        }
        return this;
    }
}
