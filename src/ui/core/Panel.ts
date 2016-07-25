
/**
 *  This the core UI component class. All other UI components has to be
 *  successor of panel class.

      // instantiate panel with no arguments
      var p = new zebkit.ui.Panel();

      // instantiate panel with border layout set as its layout manager
      var p = new zebkit.ui.Panel(new zebkit.layout.BorderLayout());

      // instantiate panel with the given properties (border
      // layout manager, blue background and plain border)
      var p = new zebkit.ui.Panel({
         layout: new zebkit.ui.BorderLayout(),
         background : "blue",
         border     : "plain"
      });

 * **Container. **
 * Panel can contains number of other UI components as its children where
 * the children components are placed with a defined by the panel layout
 * manager:

      // add few children component to panel top, center and bottom parts
      // with help of border layout manager
      var p = new zebkit.ui.Panel();
      p.setLayout(new zebkit.layout.BorderLayout(4)); // set layout manager to
                                                     // order children components

      p.add("top", new zebkit.ui.Label("Top label"));
      p.add("center", new zebkit.ui.TextArea("Text area"));
      p.add("bottom", new zebkit.ui.Button("Button"));

 * **Events. **
 * The class provides possibility to catch various component and input
 * events by declaring an appropriate event method handler. The most
 * simple case you just define a method:

      var p = new zebkit.ui.Panel();
      p.pointerPressed = function(e) {
          // handle event here
      };

* If you prefer to create an anonymous class instance you can do it as
* follow:

      var p = new zebkit.ui.Panel([
          function pointerPressed(e) {
              // handle event here
          }
      ]);

* One more way to add the event handler is dynamic extending of an instance
* class demonstrated below:

      var p = new zebkit.ui.Panel("Test");
      p.extend([
          function pointerPressed(e) {
              // handle event here
          }
      ]);

 * Pay attention Zebkit UI components often declare own event handlers and
 * in this case you can overwrite the default event handler with a new one.
 * Preventing the basic event handler execution can cause the component will
 * work improperly. You should care about the base event handler execution
 * as follow:

      // button component declares own pointer pressed event handler
      // we have to call the original handler to keep the button component
      // properly working
      var p = new zebkit.ui.Button("Test");
      p.extend([
          function pointerPressed(e) {
              this.$super(e); // call parent class event handler implementation
              // handle event here
          }
      ]);

 *  @class zebkit.ui.Panel
 *  @param {Object|zebkit.layout.Layout} [l] pass a layout manager or
 *  number of properties that have to be applied to the instance of
 *  the panel class.
 *  @constructor
 *  @extends zebkit.layout.Layoutable
 */



/**
 * Implement the event handler method to catch pointer pressed event.
 * The event is triggered every time a pointer button has been pressed or
 * a finger has touched a touch screen.

     var p = new zebkit.ui.Panel();
     p.pointerPressed = function(e) { ... }; // add event handler

 * @event pointerPressed
 * @param {zebkit.ui.PointerEvent} e a pointer event
*/

/**
 * Implement the event handler method to catch pointer released event.
 * The event is triggered every time a pointer button has been released or
 * a finger has untouched a touch screen.

     var p = new zebkit.ui.Panel();
     p.pointerReleased = function(e) { ... }; // add event handler

 * @event pointerReleased
 * @param {zebkit.ui.PointerEvent} e a pointer event
 */

/**
 * Implement the event handler method  to catch pointer moved event.
 * The event is triggered every time a pointer cursor has been moved with
 * no a pointer button pressed.

     var p = new zebkit.ui.Panel();
     p.pointerMoved = function(e) { ... }; // add event handler

 * @param {zebkit.ui.PointerEvent} e a pointer event
 * @event  pointerMoved
 */

/**
 * Implement the event handler method to catch pointer entered event.
 * The event is triggered every time a pointer cursor entered the
 * given component.

     var p = new zebkit.ui.Panel();
     p.pointerEntered = function(e) { ... }; // add event handler

 * @param {zebkit.ui.PointerEvent} e a pointer event
 * @event  pointerEntered
 */

/**
 * Implement the event handler method to catch pointer exited event.
 * The event is triggered every time a pointer cursor exited the given
 * component.

     var p = new zebkit.ui.Panel();
     p.pointerExited = function(e) { ... }; // add event handler

 * @param {zebkit.ui.PointerEvent} e a pointer event
 * @event  pointerExited
 */

/**
 * Implement the event handler method to catch pointer clicked event.
 * The event is triggered every time a pointer button has been clicked. Click events
 * are generated only if no one pointer moved or drag events has been generated
 * in between pointer pressed -> pointer released events sequence.

     var p = new zebkit.ui.Panel();
     p.pointerClicked = function(e) { ... }; // add event handler

 * @param {zebkit.ui.PointerEvent} e a pointer event
 * @event  pointerClicked
 */

/**
 * Implement the event handler method to catch pointer dragged event.
 * The event is triggered every time a pointer cursor has been moved when a pointer button
 * has been pressed. Or when a finger has been moved over a touch screen.

     var p = new zebkit.ui.Panel();
     p.pointerDragged = function(e) { ... }; // add event handler

 * @param {zebkit.ui.PointerEvent} e a pointer event
 * @event  pointerDragged
 */

/**
 * Implement the event handler method to catch pointer drag started event.
 * The event is triggered every time a pointer cursor has been moved first time when a pointer button
 * has been pressed. Or when a finger has been moved first time over a touch screen.

     var p = new zebkit.ui.Panel();
     p.pointerDragStarted = function(e) { ... }; // add event handler

 * @param {zebkit.ui.PointerEvent} e a pointer event
 * @event  pointerDragStarted
*/

/**
 * Implement the event handler method to catch pointer drag ended event.
 * The event is triggered every time a pointer cursor has been moved last time when a pointer button
 * has been pressed. Or when a finger has been moved last time over a touch screen.

     var p = new zebkit.ui.Panel();
     p.pointerDragEnded = function(e) { ... }; // add event handler

 * @param {zebkit.ui.PointerEvent} e a pointer event
 * @event  pointerDragEnded
*/

/**
 * Implement the event handler method to catch key pressed event
 * The event is triggered every time a key has been pressed.

     var p = new zebkit.ui.Panel();
     p.keyPressed = function(e) { ... }; // add event handler

 * @param {zebkit.ui.KeyEvent} e a key event
 * @event  keyPressed
 */

/**
 * Implement the event handler method to catch key types event
 * The event is triggered every time a key has been typed.

     var p = new zebkit.ui.Panel();
     p.keyTyped = function(e) { ... }; // add event handler

 * @param {zebkit.ui.KeyEvent} e a key event
 * @event  keyTyped
 */

/**
 * Implement the event handler method to catch key released event
 * The event is triggered every time a key has been released.

     var p = new zebkit.ui.Panel();
     p.keyReleased = function(e) { ... }; // add event handler

 * @param {zebkit.ui.KeyEvent} e a key event
 * @event  keyReleased
 */

/**
 * Implement the event handler method to catch the component sized event
 * The event is triggered every time the component has been re-sized.

     var p = new zebkit.ui.Panel();
     p.compSized = function(c, pw, ph) { ... }; // add event handler

 * @param {zebkit.ui.Panel} c a component that has been sized
 * @param {Integer} pw a previous width the sized component had
 * @param {Integer} ph a previous height the sized component had
 * @event compSized
 */

/**
 * Implement the event handler method to catch component moved event
 * The event is triggered every time the component location has been
 * updated.

     var p = new zebkit.ui.Panel();
     p.compMoved = function(c, px, py) { ... }; // add event handler

 * @param {zebkit.ui.Panel} c a component that has been moved
 * @param {Integer} px a previous x coordinate the moved component had
 * @param {Integer} py a previous y coordinate the moved component had
 * @event compMoved
 */

/**
 * Implement the event handler method to catch component enabled event
 * The event is triggered every time a component enabled state has been
 * updated.

     var p = new zebkit.ui.Panel();
     p.compEnabled = function(c) { ... }; // add event handler

 * @param {zebkit.ui.Panel} c a component whose enabled state has been updated
 * @event compEnabled
 */

/**
 * Implement the event handler method to catch component shown event
 * The event is triggered every time a component visibility state has
 * been updated.

     var p = new zebkit.ui.Panel();
     p.compShown = function(c) { ... }; // add event handler

 * @param {zebkit.ui.Panel} c a component whose visibility state has been updated
 * @event compShown
 */

/**
 * Implement the event handler method to catch component added event
 * The event is triggered every time the component has been inserted into
 * another one.

     var p = new zebkit.ui.Panel();
     p.compAdded = function(p, constr, c) { ... }; // add event handler

 * @param {zebkit.ui.Panel} p a parent component of the component has been added
 * @param {Object} constr a layout constraints
 * @param {zebkit.ui.Panel} c a component that has been added
 * @event compAdded
 */

/**
 * Implement the event handler method to catch component removed event
 * The event is triggered every time the component has been removed from
 * its parent UI component.

     var p = new zebkit.ui.Panel();
     p.compRemoved = function(p, i, c) { ... }; // add event handler

 * @param {zebkit.ui.Panel} p a parent component of the component that has been removed
 * @param {Integer} i an index of removed component
 * @param {zebkit.ui.Panel} c a component that has been removed
 * @event compRemoved
 */

/**
 * Implement the event handler method to catch component focus gained event
 * The event is triggered every time a component has gained focus.

     var p = new zebkit.ui.Panel();
     p.focusGained = function(e) { ... }; // add event handler

 * @param {zebkit.ui.FocusEvent} e an input event
 * @event  focusGained
 */

/**
 * Implement the event handler method to catch component focus lost event
 * The event is triggered every time a component has lost focus

     var p = new zebkit.ui.Panel();
     p.focusLost = function(e) { ... }; // add event handler

 * @param {zebkit.ui.FocusEvent} e an input event
 * @event  focusLost
 */

/**
 * Implement the event handler method to catch children components component events
 *
     var p = new zebkit.ui.Panel();
     p.childCompEvent = function(id, src, p1, p2) { ... }; // add event handler

 * @param {Integer} id a component event ID. The id can have one of the following value:


 * @param {zebkit.ui.Panel} src a component that triggers the event
 * @param {zebkit.ui.Panel|Integer|Object} p1 an event first parameter that depends
 * on an component event that has happened:


   - if id is **zebkit.ui.Panel.SIZED** the parameter is previous component width
   - if id is **zebkit.ui.Panel.MOVED** the parameter is previous component x location
   - if id is **zebkit.ui.Panel.ADDED** the parameter is constraints a new component has been added
   - if id is **zebkit.ui.Panel.REMOVED** the parameter is null

 * @param {zebkit.ui.Panel|Integer|Object} p2 an event second parameter depends
 * on an component event that has happened:


    - if id is **zebkit.ui.Panel.SIZED** the parameter is previous component height
    - if id is **zebkit.ui.Panel.MOVED** the parameter is previous component y location
    - if id is **zebkit.ui.Panel.ADDED** the parameter is reference to the added children component
    - if id is **zebkit.ui.Panel.REMOVED** the parameter is reference to the removed children component

 * @event  childCompEvent
 */

 /**
  * The method is called for focusable UI components (components that can hold input focus) to ask
  * a string to be saved in native clipboard
  *
  * @return {String} a string to be copied in native clipboard
  *
  * @event clipCopy
  */

 /**
  * The method is called to pass string from clipboard to a focusable (a component that can hold
  * input focus) UI component
  *
  * @param {String} s a string from native clipboard
  *
  * @event clipPaste
  */

import layout from '../layout';
import html from '../html';
import HtmlElement from './HtmlElement';
import views from '../views';

var temporary = { x:0, y:0, width:0, height:0 }

export default class Panel extends layout.Layoutable {
    isEnabled: boolean;
    top: number;
    left: number;
    right: number; 
    bottom: number;
    kids: any[];
    layout: any; // Layout;
    clazz: any;
    isVisible: boolean;
    parent: any;

    constructor() {
      super();

        /**
         * UI component border view
         * @attribute border
         * @default null
         * @readOnly
         * @type {zebkit.ui.View}
         */

        /**
         * UI component background view
         * @attribute bg
         * @default null
         * @readOnly
         * @type {zebkit.ui.View}
        */

        /**
         * Define and set the property to true if the component has to catch focus
         * @attribute canHaveFocus
         * @type {Boolean}
         * @default undefined
         */

        this.top = this.left = this.right = this.bottom = 0;

        /**
         * UI component enabled state
         * @attribute isEnabled
         * @default true
         * @readOnly
         * @type {Boolean}
         */
        this.isEnabled = true;     

        // !!! dirty trick to call super, for the sake of few milliseconds back
        // this.$super();
        if (typeof this.kids === "undefined") {
            this.kids = [];
        }

        if (this.layout == null) {
            this.layout = this;
        }

        if (this.clazz.parentPropsLookup === true) {
            // instead of recursion collect stack in array than go through it
            var hierarchy = [],
                pp        = this.clazz;

            // collect clazz hierarchy
            while(pp.$parent !== null && pp.parentPropsLookup === true) {
                pp = pp.$parent;
                hierarchy[hierarchy.length] = pp;
            }

            // fire properties from the hierarchy
            for(var i = hierarchy.length; i >= 0; i--) {
                this.properties(hierarchy[i]);
            }
        }
        this.properties(this.clazz);

        if (arguments.length > 0) {
            if (l.constructor === Object) {
                this.properties(l);
            } else {
                this.setLayout(l);
            }
        }         
    }


    // TODO: not stable api, probably it should be moved to static
    wrapWithCanvas() {
        var c = new html.HtmlCanvas();
        c.setLayout(new layout.StackLayout());
        c.add(this);
        return c;
    }

    // TODO: not stable api, probably it should be moved to static
    wrapWithHtmlElement() {
        var c = new HtmlElement();
        c.setLayout(new layout.StackLayout());
        c.add(this);
        return c;
    }

    /**
     * Request the whole UI component or part of the UI component to be repainted
     * @param  {Integer} [x] x coordinate of the component area to be repainted
     * @param  {Integer} [y] y coordinate of the component area to be repainted
     * @param  {Integer} [w] width of the component area to be repainted
     * @param  {Integer} [h] height of the component area to be repainted
     * @method repaint
     */
    repaint(x,y,w,h) {
        // step I: skip invisible components and components that are not in hierarchy
        //         don't initiate repainting thread for such sort of the components,
        //         but don't forget for zCanvas whose parent field is null, but it has $context
        if (this.isVisible === true && (this.parent != null || this.$context != null)) {
            //!!! find context buffer that holds the given component

            var canvas = this;
            for(; canvas.$context == null; canvas = canvas.parent) {
                // component either is not in visible state or is not in hierarchy
                // than stop repaint procedure
                if (canvas.isVisible === false || canvas.parent == null) {
                    return;
                }
            }

            // no arguments means the whole component has top be repainted
            if (arguments.length === 0) {
                x = y = 0;
                w = this.width;
                h = this.height;
            }

            // step II: calculate new actual dirty area
            if (w > 0 && h > 0) {
                var r = pkg.$cvp(this, temporary);
                if (r != null) {
                    zebkit.util.intersection(r.x, r.y, r.width, r.height, x, y, w, h, r);
                    if (r.width > 0 && r.height > 0) {
                        x = r.x;
                        y = r.y;
                        w = r.width;
                        h = r.height;

                        // calculate repainted component absolute location
                        var cc = this;
                        while (cc != canvas) {
                            x += cc.x;
                            y += cc.y;
                            cc = cc.parent;
                        }

                        // normalize repaint area coordinates
                        if (x < 0) {
                            w += x;
                            x = 0;
                        }
                        if (y < 0) {
                            h += y;
                            y = 0;
                        }
                        if (w + x > canvas.width ) w = canvas.width - x;
                        if (h + y > canvas.height) h = canvas.height - y;

                        // still have what to repaint than calculate new
                        // dirty area of target canvas element
                        if (w > 0 && h > 0) {
                            var da = canvas.$da;

                            // if the target canvas already has a dirty area set than
                            // unite it with requested
                            if (da.width > 0) {
                                // check if the requested repainted area is not in
                                // exiting dirty area
                                if (x < da.x                ||
                                    y < da.y                ||
                                    x + w > da.x + da.width ||
                                    y + h > da.y + da.height  )
                                {
                                    // !!!
                                    // speed up to comment method call
                                    //MB.unite(da.x, da.y, da.width, da.height, x, y, w, h, da);
                                    var dax = da.x, day = da.y;
                                    if (da.x > x) da.x = x;
                                    if (da.y > y) da.y = y;
                                    da.width  = Math.max(dax + da.width,  x + w) - da.x;
                                    da.height = Math.max(day + da.height, y + h) - da.y;
                                }
                            } else {
                                // if the target canvas doesn't have a dirty area set than
                                // cut (if necessary) the requested repainting area by the
                                // canvas size

                                // !!!
                                // not necessary to call the method since we have already normalized
                                // repaint coordinates and sizes
                                //!!! MB.intersection(0, 0, canvas.width, canvas.height, x, y, w, h, da);

                                da.x      = x;
                                da.width  = w;
                                da.y      = y;
                                da.height = h;
                            }
                        }
                    }
                }
            }

            // step III: initiate repainting thread
            if (canvas.$paintTask === null && (canvas.isValid === false || canvas.$da.width > 0 || canvas.isLayoutValid === false)) {
                var $this = this;
                canvas.$paintTask = zebkit.web.$task(function() {
                    var g = null;
                    try {
                        // do validation before timer will be set to null to avoid
                        // unnecessary timer initiating what can be caused by validation
                        // procedure by calling repaint method
                        if (canvas.isValid === false || canvas.isLayoutValid === false) {
                            canvas.validate();
                        }

                        if (canvas.$da.width > 0) {
                            g = canvas.$context;
                            g.save();

                            // check if the given canvas has transparent background
                            // if it is true call clearRect method to clear dirty area
                            // with transparent background, otherwise it will be cleaned
                            // by filling the canvas with background later
                            if (canvas.bg == null || canvas.bg.isOpaque !== true) {
                                g.clearRect(canvas.$da.x, canvas.$da.y,
                                            canvas.$da.width, canvas.$da.height);
                            }
                            // !!!
                            // call clipping area later than possible
                            // clearRect since it can bring to error in IE
                            g.clipRect(canvas.$da.x,
                                        canvas.$da.y,
                                        canvas.$da.width,
                                        canvas.$da.height);

                            canvas.paintComponent(g);
                        }

                        canvas.$paintTask = null;
                        // no dirty area anymore
                        canvas.$da.width = -1;
                        if (g !== null) g.restore();
                    }
                    catch(ee) {
                        canvas.$paintTask = null;
                        canvas.$da.width = -1;
                        if (g !== null) {
                            g.restoreAll();
                        }
                        throw ee;
                    }
                });
            }
        }
    }

    // destination is component itself or one of his composite parent.
    // composite component is a component that grab control from his
    // children component. to make a component composite
    // it has to implement catchInput field or method. If composite component
    // has catchInput method it will be called
    // to detect if the composite component takes control for the given kid.
    // composite components can be embedded (parent composite can take
    // control on its child composite component)
    getEventDestination() {
        var c = this, p = this;
        while ((p = p.parent) != null) {
            if (p.catchInput != null && (p.catchInput === true || (p.catchInput !== false && p.catchInput(c)))) {
                c = p;
            }
        }
        return c;
    }

    paintComponent(g) {
        var ts = g.$states[g.$curState];
        if (ts.width  > 0  &&
            ts.height > 0  &&
            this.isVisible === true)
        {
            // !!!
            // calling setSize in the case of raster layout doesn't
            // cause hierarchy layout invalidation
            if (this.isLayoutValid === false) {
                this.validate();
            }

            var b = this.bg != null && (this.parent == null || this.bg != this.parent.bg);

            // if component defines shape and has update, [paint?] or background that
            // differs from parent background try to apply the shape and than build
            // clip from the applied shape
            if ( (this.border != null && this.border.outline != null) &&
                  (b || this.update != null)                           &&
                  this.border.outline(g, 0, 0, this.width, this.height, this))
            {
                g.save();
                g.clip();

                if (b) {
                    this.bg.paint(g, 0, 0, this.width, this.height, this);
                }

                if (this.update != null) {
                    this.update(g);
                }

                g.restore();
            } else {
                if (b) {
                    this.bg.paint(g, 0, 0, this.width, this.height, this);
                }
                if (this.update != null) this.update(g);
            }

            if (this.border != null) {
                this.border.paint(g, 0, 0, this.width, this.height, this);
            }

            if (this.paint != null) {
                var left   = this.getLeft(),
                    top    = this.getTop(),
                    bottom = this.getBottom(),
                    right  = this.getRight();

                if (left > 0 || right > 0 || top > 0 || bottom > 0) {
                    if (ts.width > 0 && ts.height > 0) {
                        var x1   = (ts.x > left ? ts.x : left),
                            y1   = (ts.y > top  ? ts.y : top),
                            cxcw = ts.x + ts.width,
                            cych = ts.y + ts.height,
                            cright = this.width - right,
                            cbottom = this.height - bottom;

                        g.save();
                        g.clipRect(x1, y1, (cxcw < cright  ? cxcw : cright)  - x1,
                                            (cych < cbottom ? cych : cbottom) - y1);
                        this.paint(g);
                        g.restore();
                    }
                } else {
                    this.paint(g);
                }
            }

            var count = this.kids.length;
            for(var i = 0; i < count; i++) {
                var kid = this.kids[i];
                if (kid.isVisible === true && kid.$context == null) {
                    // calculate if the given component area has intersection
                    // with current clipping area
                    var kidXW = kid.x + kid.width,
                        c_xw  = ts.x + ts.width,
                        kidYH = kid.y + kid.height,
                        c_yh  = ts.y + ts.height,
                        iw = (kidXW < c_xw ? kidXW : c_xw) - (kid.x > ts.x ? kid.x : ts.x),
                        ih = (kidYH < c_yh ? kidYH : c_yh) - (kid.y > ts.y ? kid.y : ts.y);

                    if (iw > 0 && ih > 0) {
                        g.save();
                        g.translate(kid.x, kid.y);
                        g.clipRect(0, 0, kid.width, kid.height);
                        kid.paintComponent(g);
                        g.restore();
                    }
                }
            }

            if (this.paintOnTop != null) this.paintOnTop(g);
        }
    }



    /**
     * Find a zebkit.ui.zCanvas where the given UI component is hosted
     * @return {zebkit.ui.zCanvas} a zebkit canvas
     * @method getCanvas
     */
    getCanvas() {
        var c = this;
        for(; c != null && c.$isRootCanvas !== true; c = c.parent);
        return c;
    }

    notifyRender(o,n){
        if (o != null && o.ownerChanged != null) o.ownerChanged(null);
        if (n != null && n.ownerChanged != null) n.ownerChanged(this);
    }

    /**
     * Shortcut method to register the specific to the concrete component
     * events listener. For instance "zebkit.ui.Button" component fires event
     * when it is pressed:

    var b = new zebkit.ui.Button("Test");
    b.bind(function() {
        // button has been pressed
    });


      * @param {Function|Object} a listener function or an object that
      * declares events handler methods
      * @return {Function|Object} a registered listener
      * @method bind
      */

    /**
     * Shortcut method to remove the register component specific events listener
     * @param {Function|Object} a listener function to be removed
     * @method unbind
     */


    /**
     * Load content of the panel UI components from the specified JSON file.
     * @param  {String} jsonPath an URL to a JSON file that describes UI
     * to be loaded into the panel
     * @chainable
     * @method load
     */
    load(jsonPath, cb) {
        new Bag(this).load(jsonPath, cb);
        return this;
    }

    /**
     * Get a children UI component that embeds the given point.
     * @param  {Integer} x x coordinate
     * @param  {Integer} y y coordinate
     * @return {zebkit.ui.Panel} a children UI component
     * @method getComponentAt
     */
    getComponentAt(x,y){
        var r = pkg.$cvp(this, temporary);

        if (r === null ||
            (x < r.x || y < r.y || x >= r.x + r.width || y >= r.y + r.height))
        {
            return null;
        }

        if (this.kids.length > 0){
            for(var i = this.kids.length; --i >= 0; ){
                var kid = this.kids[i];
                kid = kid.getComponentAt(x - kid.x,
                                          y - kid.y);
                if (kid != null) return kid;
            }
        }
        return this.contains == null || this.contains(x, y) === true ? this : null;
    }

    /**
     * Shortcut method to invalidating the component
     * and initiating the component repainting
     * @method vrp
     */
    vrp() {
        this.invalidate();

        // extra condition to save few millisecond on repaint() call
        if (this.isVisible === true && this.parent != null) {
            this.repaint();
        }
    }

    getTop() {
        return this.border != null ? this.top + this.border.getTop()
                                    : this.top;
    }

    getLeft() {
        return this.border != null ? this.left + this.border.getLeft()
                                    : this.left;
    }

    getBottom() {
        return this.border != null ? this.bottom + this.border.getBottom()
                                    : this.bottom;
    };

    getRight() {
        return this.border != null ? this.right  + this.border.getRight()
                                    : this.right;
    }

    //TODO: the method is not used yet
    isInvalidatedByChild(c) {
        return true;
    }

    /**
     * The method is implemented to be aware about a children component
     * insertion.
     * @param  {Integer} index an index at that a new children component
     * has been added
     * @param  {Object} constr a layout constraints of an inserted component
     * @param  {zebkit.ui.Panel} l a children component that has been inserted
     * @method kidAdded
     */
    kidAdded(index,constr,l){
        COMP_EVENT.source = this;
        COMP_EVENT.constraints = constr;
        COMP_EVENT.kid = l;

        pkg.events.fireEvent("compAdded", COMP_EVENT);

        if (l.width > 0 && l.height > 0) {
            l.repaint();
        } else {
            this.repaint(l.x, l.y, 1, 1);
        }
    }

    /**
     * Set the component layout constraints.
     * @param {Object} ctr a constraints
     * @method setConstraints
     */
    setConstraints(ctr) {
        if (this.constraints != ctr) {
            this.constraints = ctr;
            if (this.parent !== null) this.vrp();
        }
        return this;
    }

    /**
     * The method is implemented to be aware about a children component
     * removal.
     * @param  {Integer} i an index of a removed component
     * @param  {zebkit.ui.Panel} l a removed children component
     * @method kidRemoved
     */
    kidRemoved(i,l){
        COMP_EVENT.source = this;
        COMP_EVENT.index  = i;
        COMP_EVENT.kid    = l;
        pkg.events.fireEvent("compRemoved", COMP_EVENT);
        if (l.isVisible === true) {
            this.repaint(l.x, l.y, l.width, l.height);
        }
    }

    /**
     * The method is implemented to be aware the
     * component location updating
     * @param  {Integer} px a previous x coordinate of the component
     * @param  {Integer} py a previous y coordinate of the component
     * @method relocated
     */
    relocated(px, py) {
        COMP_EVENT.source = this;
        COMP_EVENT.prevX  = px;
        COMP_EVENT.prevY  = py;
        pkg.events.fireEvent("compMoved", COMP_EVENT);

        var p = this.parent,
            w = this.width,
            h = this.height;

        if (p != null && w > 0 && h > 0) {
            var x = this.x,
                y = this.y,
                nx = x < px ? x : px,
                ny = y < py ? y : py;

            //TODO: some mobile browser has bug: moving a component
            //      leaves 0.5 sized traces to fix it 1 pixel extra
            //      has to be added to all sides of repainted rect area
            // nx--;
            // ny--;

            if (nx < 0) nx = 0;
            if (ny < 0) ny = 0;

            var w1 = p.width - nx,
                w2 = w + (x > px ? x - px : px - x),
                h1 = p.height - ny,
                h2 = h + (y > py ? y - py : py - y);

            // TODO: add crappy 2 for mobile (android)
            p.repaint(nx, ny, (w1 < w2 ? w1 : w2),// + 2,
                              (h1 < h2 ? h1 : h2));// + 2);
        }
    }

    /**
     * The method is implemented to be aware the
     * component size updating
     * @param  {Integer} pw a previous width of the component
     * @param  {Integer} ph a previous height of the component
     * @method resized
     */
    resized(pw,ph) {
        COMP_EVENT.source = this;
        COMP_EVENT.prevWidth  = pw;
        COMP_EVENT.prevHeight = ph;
        pkg.events.fireEvent("compSized", COMP_EVENT);

        if (this.parent != null) {
            this.parent.repaint(this.x, this.y,
                                ((this.width  > pw) ? this.width  : pw),
                                ((this.height > ph) ? this.height : ph));
        }
    }

    /**
     * Checks if the component has a focus
     * @return {Boolean} true if the component has focus
     * @method hasFocus
     */
    hasFocus(){
        return pkg.focusManager.hasFocus(this);
    }

    /**
     * Force the given component to catch focus if the component is focusable.
     * @method requestFocus
     */
    requestFocus(){
        pkg.focusManager.requestFocus(this);
    }

    /**
     * Force the given component to catch focus in the given timeout.
     * @param {Integer} [timeout] a timeout in milliseconds. The default value is 50
     * milliseconds
     * @method requestFocusIn
     */
    requestFocusIn(timeout) {
        if (arguments.length === 0) {
            timeout = 50;
        }
        var $this = this;
        setTimeout(function () {
            $this.requestFocus();
        }, timeout);
    }

    /**
     * Set the UI component visibility
     * @param  {Boolean} b a visibility state
     * @method setVisible
     * @chainable
     */
    setVisible(b){
        if (this.isVisible != b) {
            this.isVisible = b;
            this.invalidate();

            COMP_EVENT.source = this;
            pkg.events.fireEvent("compShown", COMP_EVENT);

            if (this.parent != null) {
                if (b) this.repaint();
                else {
                    this.parent.repaint(this.x, this.y, this.width, this.height);
                }
            }
        }
        return this;
    }

    /**
     *  Set the UI component enabled state. Using this property
     *  an UI component can be excluded from getting input events
     *  @param  {Boolean} b a enabled state
     *  @method setEnabled
     *  @chainable
     */
    setEnabled(b){
        if (this.isEnabled != b){
            this.isEnabled = b;

            COMP_EVENT.source = this;
            pkg.events.fireEvent("compEnabled", COMP_EVENT);
            if (this.kids.length > 0) {
                for(var i = 0;i < this.kids.length; i++) {
                    this.kids[i].setEnabled(b);
                }
            }
            this.repaint();
        }
        return this;
    }

    /**
     * Set the UI component top, right, left, bottom paddings to the same given value
     * @param  {Integer} v the value that will be set as top, right, left, bottom UI
     * component paddings
     * @method setPadding
     * @chainable
     */

    /**
     * Set UI component top, left, bottom, right paddings. The paddings are
     * gaps between component border and painted area.
     * @param  {Integer} top a top padding
     * @param  {Integer} left a left padding
     * @param  {Integer} bottom a bottom padding
     * @param  {Integer} right a right padding
     * @method setPadding
     * @chainable
     */
    setPadding(top,left,bottom,right){
        if (arguments.length === 1) {
            left = bottom = right = top;
        }

        if (this.top    !== top    || this.left  !== left  ||
            this.bottom !== bottom || this.right !== right   )
        {
            this.top = top;
            this.left = left;
            this.bottom = bottom;
            this.right = right;
            this.vrp();
        }
        return this;
    }

    setTopPadding(top) {
        if (this.top !== top) {
            this.top = top;
            this.vrp();
        }
        return this;
    }

    setLeftPadding(left) {
        if (this.left !== left) {
            this.left = left;
            this.vrp();
        }
        return this;
    }

    setBottomPadding(bottom) {
        if (this.bottom !== bottom) {
            this.bottom = bottom;
            this.vrp();
        }
        return this;
    }

    setRightPadding(right) {
        if (this.right !== right) {
            this.right = right;
            this.vrp();
        }
        return this;
    }

    /**
     * Set the border view
     * @param  {zebkit.ui.View|Function|String} v a border view or border "paint(g,x,y,w,h,c)"
     * rendering function or border type: "plain", "sunken", "raised", "etched"
     * @method setBorder
     * @chainable
     */
    setBorder(v) {
        var old = this.border;
        v = pkg.$view(v);
        if (v != old){
            this.border = v;
            this.notifyRender(old, v);

            if ( old == null || v == null         ||
                  old.getTop()    != v.getTop()    ||
                  old.getLeft()   != v.getLeft()   ||
                  old.getBottom() != v.getBottom() ||
                  old.getRight()  != v.getRight()     )
            {
                this.invalidate();
            }

            if (v != null && v.activate != null) {
                v.activate(this.hasFocus() ?  "focuson": "focusoff");
            }

            this.repaint();
        }
        return this;
    }

    /**
     * Set the background. Background can be a color string or a zebkit.ui.View class
     * instance, or a function(g,x,y,w,h,c) that paints the background:

        // set background color
        comp.setBackground("red");

        // set a picture as a component background
        comp.setBackground(new zebkit.ui.Picture(...));

        // set a custom rendered background
        comp.setBackground(function (g,x,y,w,h,target) {
            // paint a component background here
            g.setColor("blue");
            g.fillRect(x,y,w,h);
            g.drawLine(...);
            ...
        });


      * @param  {String|zebkit.ui.View|Function} v a background view, color or
      * background "paint(g,x,y,w,h,c)" rendering function.
      * @method setBackground
      * @chainable
      */
    setBackground(v){
        var old = this.bg;
        v = pkg.$view(v);
        if (v != old) {
            this.bg = v;
            this.notifyRender(old, v);
            this.repaint();
        }
        return this;
    }

    /**
     * Add the given children component or number of components to the given panel.
     * @protected
     * @param {zebkit.ui.Panel|Array|Object} a children component of number of
     * components to be added. The parameter can be:

- Component
- Array of components
- Dictionary object where every element is a component to be added and the key of
the component is stored in the dictionary is considered as the component constraints

      * @method setKids
      */
    setKids(a) {
        if (arguments.length === 1 && zebkit.instanceOf(a, pkg.Panel)) {
            this.add(a);
        } else {
            // if components list passed as number of arguments
            if (arguments.length > 1) {
                for(var i = 0; i < arguments.length; i++) {
                    var a = arguments[i];
                    if (a != null) {
                        this.add(a.$new != null ? a.$new() : a);
                    }
                }
            } else {
                if (Array.isArray(a)) {
                    for(var i=0; i < a.length; i++) {
                        if (a[i] != null) {
                            this.add(a[i]);
                        }
                    }
                } else {
                    var kids = a;
                    for(var k in kids) {
                        if (kids.hasOwnProperty(k)) {
                            this.add(k, kids[k]);
                        }
                    }
                }
            }
        }
    }

    /**
     * Called whenever the UI component gets or looses focus
     * @method focused
     */
    focused() {
        // extents of activate method indicates it is
        if (this.border != null && this.border.activate != null) {
            var id = this.hasFocus() ? "focuson" : "focusoff" ;
            if (typeof this.border.views[id] !== 'undefined') {
                this.border.activate(id);
                this.repaint();
            }
        }

        // TODO: think if the background has to be focus dependent
        // if (this.bg != null && this.bg.activate != null) {
        //     var id = this.hasFocus() ? "focuson" : "focusoff" ;
        //     if (this.bg.views[id]) {
        //         this.bg.activate(id);
        //         this.repaint();
        //     }
        // }
    }

    /**
     * Remove all children UI components
     * @method removeAll
     */
    removeAll(){
        if (this.kids.length > 0){
            var size = this.kids.length, mx1 = Number.MAX_VALUE, my1 = mx1, mx2 = 0, my2 = 0;
            for(; size > 0; size--){
                var child = this.kids[size - 1];
                if (child.isVisible === true){
                    var xx = child.x, yy = child.y;
                    mx1 = mx1 < xx ? mx1 : xx;
                    my1 = my1 < yy ? my1 : yy;
                    mx2 = Math.max(mx2, xx + child.width);
                    my2 = Math.max(my2, yy + child.height);
                }
                this.removeAt(size - 1);
            }
            this.repaint(mx1, my1, mx2 - mx1, my2 - my1);
        }
    }

    /**
     * Bring the UI component to front
     * @method toFront
     */
    toFront(){
        if (this.parent != null && this.parent.kids[this.parent.kids.length-1] !== this){
            var p = this.parent;
            p.kids.splice(p.indexOf(this), 1);
            p.kids[p.kids.length] = this;
            p.vrp();
        }
        return this;
    }

    /**
     * Send the UI component to back
     * @method toBack
     */
    toBack(){
        if (this.parent != null && this.parent.kids[0] !== this){
            var p = this.parent;
            p.kids.splice(p.indexOf(this), 1);
            p.kids.unshift(this);
            p.vrp();
        }
        return this;
    }

    /**
     * Set the UI component size to its preferred size
     * @return {Object} a preferred size applied to the component.
     * The structure of the returned object is the following:

        { width:{Integer}, height:{Integer} }

      * @method toPreferredSize
      */
    toPreferredSize(){
        var ps = this.getPreferredSize();
        this.setSize(ps.width, ps.height);
        return ps;
    }

    /**
     * Build view by this component
     * @return {zebkit.ui.View} a view of the component
     * @param [{target}]
     * @method toView
     */
    toView(target) {
        return new views.CompRender(this);
    };

    // TODO: not stable API
    paintViewAt(g, ax, ay, v) {
        var x  = this.getLeft(),
            y  = this.getTop(),
            ps = v.getPreferredSize();

        if (ax === "center") {
            x = Math.floor((this.width - ps.width)/2);
        }
        else if (ax === "right") {
            x = this.width - this.getRight() - ps.width;
        }

        if (ay === "center") {
            y = Math.floor((this.height - ps.height)/2);
        }
        else if (ay === "bottom") {
            y = this.height - this.getBottom() - ps.height;
        }

        v.paint(g, x, y, ps.width, ps.height, this);
    }
}

