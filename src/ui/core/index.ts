/**
 * Zebkit UI. The UI is powerful way to create any imaginable
 * user interface for WEB. The idea is based on developing
 * hierarchy of UI components that sits and renders on HTML5
 * Canvas element.
 *
 * Write zebkit UI code in safe place where you can be sure all
 * necessary structure, configurations, etc are ready. The safe
 * place is "zebkit.ready(...)" method. Development of zebkit UI
 * application begins from creation "zebkit.ui.zCanvas" class,
 * that is starting point and root element of your UI components
 * hierarchy. "zCanvas" is actually wrapper around HTML5 Canvas
 * element where zebkit UI sits on. The typical zebkit UI coding
 * template is shown below:

     // build UI in safe place
     zebkit.ready(function() {
        // create canvas element
        var c = new zebkit.ui.zCanvas(400, 400);

        // start placing UI component on c.root panel
        //set layout manager
        c.root.setLayout(new zebkit.layout.BorderLayout());
        //add label to top
        c.root.add("top",new zebkit.ui.Label("Top label"));
        //add text area to center
        c.root.add("center",new zebkit.ui.TextArea(""));
        //add button area to bottom
        c.root.add("bottom",new zebkit.ui.Button("Button"));
        ...
     });

 *  The latest version of zebkit JavaScript is available in repository:

        <script src='http://repo.zebkit.org/latest/zebkit.min.js'
                type='text/javascript'></script>

 * @module ui
 * @main ui
 * @requires zebkit, util, io, data
 */

var temporary = { x:0, y:0, width:0, height:0 }, COMP_EVENT, FOCUS_EVENT;















/**
 * Base layer UI component. Layer is special type of UI
 * components that is used to decouple different logical
 * UI components types from each other. Zebkit Canvas
 * consists from number of layers where only one can be
 * active at the given point in time. Layers are stretched
 * to fill full canvas size. Every time an input event
 * happens system detects an active layer by asking all
 * layers from top to bottom. First layer that wants to
 * catch input gets control. The typical layers examples
 * are window layer, pop up menus layer and so on.
 * @param {String} id an unique id to identify the layer
 * @constructor
 * @class zebkit.ui.CanvasLayer
 * @extends {zebkit.ui.Panel}
 */
pkg.CanvasLayer = Class(pkg.HtmlCanvas, [
    function $prototype() {
        /**
         *  Define the method to catch pointer pressed event and
         *  answer if the layer wants to have a control.
         *  If the method is not defined it is considered as the
         *  layer is not activated by the pointer event
         *  @param {zebkit.ui.PointerEvent} e a pointer event
         *  @return {Boolean} return true if the layer wants to
         *  catch control
         *  @method pointerPressed
         */

        /**
         *  Define the method to catch key pressed event and
         *  answer if the layer wants to have a control.
         *  If the method is not defined it is considered
         *  as the key event doesn't activate the layer
         *  @param {zebkit.ui.KeyEvent} e a key code
         *  @return {Boolean} return true if the layer wants to
         *  catch control
         *  @method keyPressed
         */
    },

    function() {
        this.$super();
        this.id = this.clazz.ID;
    }
]);

/**
 *  Root layer implementation. This is the simplest UI layer implementation
 *  where the layer always try grabbing all input event
 *  @class zebkit.ui.RootLayer
 *  @constructor
 *  @extends {zebkit.ui.CanvasLayer}
 */
pkg.RootLayer = Class(pkg.CanvasLayer, [
    function $clazz() {
        this.ID = "root";
        this.layout = new zebkit.layout.RasterLayout();
    },

    function $prototype() {
        this.getFocusRoot = function() {
            return this;
        };
    }
]);

/**
 *  UI component to keep and render the given "zebkit.ui.View" class
 *  instance. The target view defines the component preferred size
 *  and the component view.
 *  @class zebkit.ui.ViewPan
 *  @constructor
 *  @extends {zebkit.ui.Panel}
 */
pkg.ViewPan = Class(pkg.Panel, [
    function $prototype() {
        /**
         * Reference to a view that the component visualize
         * @attribute view
         * @type {zebkit.ui.View}
         * @default null
         * @readOnly
         */
        this.view = null;

        this.paint = function (g){
            if (this.view !== null){
                var l = this.getLeft(),
                    t = this.getTop();

                this.view.paint(g, l, t, this.width  - l - this.getRight(),
                                         this.height - t - this.getBottom(), this);
            }
        };

        /**
         * Set the target view to be wrapped with the UI component
         * @param  {zebkit.ui.View|Function} v a view or a rendering
         * view "paint(g,x,y,w,h,c)" function
         * @method setView
         * @chainable
         */
        this.setView = function(v){
            var old = this.view;
            v = pkg.$view(v);

            if (v !== old) {
                this.view = v;
                this.notifyRender(old, v);
                this.vrp();
            }

            return this;
        };

        /**
         * Override the parent method to calculate preferred size
         * basing on a target view.
         * @param  {zebkit.ui.Panel} t [description]
         * @return {Object} return a target view preferred size if it is defined.
         * The returned structure is the following:
              { width: {Integer}, height:{Integer} }
         * @method  calcPreferredSize
         */
        this.calcPreferredSize = function (t) {
            return this.view !== null ? this.view.getPreferredSize() : { width:0, height:0 };
        };
    }
]);

/**
 *  Image panel UI component class. The component renders an image.
 *  @param {String|Image} [img] a path or direct reference to an image object.
 *  If the passed parameter is string it considered as path to an image.
 *  In this case the image will be loaded using the passed path.
 *  @class zebkit.ui.ImagePan
 *  @constructor
 *  @extends zebkit.ui.ViewPan
 */
pkg.ImagePan = Class(pkg.ViewPan, [
    function(img, w, h) {
        this.$runner = null;
        this.setImage(img != null ? img : null);
        this.$super();
        if (arguments.length > 2) this.setPreferredSize(w, h);
    },

    /**
     * Set image to be rendered in the UI component
     * @method setImage
     * @param {String|Image|zebkit.ui.Picture} img a path or direct reference to an
     * image or zebkit.ui.Picture render.
     * If the passed parameter is string it considered as path to an image.
     * In this case the image will be loaded using the passed path
     * @chainable
     */
    function setImage(img) {
        if (img != null) {
            var $this     = this,
                isPic     = zebkit.instanceOf(img, pkg.Picture),
                imgToLoad = isPic ? img.target : img ;

            if (this.$runner == null) {
                this.$runner = new zebkit.util.Runner();
            }

            this.$runner.run(function() {
                zebkit.web.$loadImage(imgToLoad, this.join());
            })
            .
            run(function(p, b, i) {
                $this.$runner = null;
                if (b) {
                    $this.setView(isPic ? img : new pkg.Picture(i));
                    $this.vrp();
                }

                if ($this.imageLoaded != null) {
                    $this.imageLoaded(p, b, i);
                }

                // TODO: should be generalized for the whole hierarchy, not only for one
                // parent
                if ($this.parent !== null && $this.parent.childImageLoaded != null) {
                     $this.parent.childImageLoaded(p, b, i);
                }
            })
            .
            error(function() {
                this.$runner = null;
                $this.setView(null);
            });
        } else {
            if (this.$runner == null) {
                this.setView(null);
            } else {
                var $this = this;
                this.$runner.run(function() {
                    $this.setView(null);
                });
            }
        }
        return this;
    }
]);

/**
 *  UI manager class. The class is widely used as base for building
 *  various UI managers like paint, focus, event etc. Manager is
 *  automatically registered as input and component events listener
 *  if it implements appropriate events methods handlers
 *  @class zebkit.ui.Manager
 *  @constructor
 */
pkg.Manager = Class([
    function() {
        if (pkg.events != null) {
            pkg.events.bind(this);
        }
    }
]);

/**
 * Focus manager class defines the strategy of focus traversing among
 * hierarchy of UI components. It keeps current focus owner component
 * and provides API to change current focus component
 * @class zebkit.ui.FocusManager
 * @extends {zebkit.ui.Manager}
 */
pkg.FocusManager = Class(pkg.Manager, [
    function $prototype() {
        /**
         * Reference to the current focus owner component.
         * @attribute focusOwner
         * @readOnly
         * @type {zebkit.ui.Panel}
         */
        this.focusOwner = null;

        this.$freeFocus = function(comp) {
            if ( this.focusOwner != null &&
                (this.focusOwner === comp || zebkit.layout.isAncestorOf(comp, this.focusOwner)))
            {
                this.requestFocus(null);
            }
        };

        /**
         * Component enabled event handler
         * @param  {zebkit.ui.Panel} c a component
         * @method compEnabled
         */
        this.compEnabled = function(e) {
            var c = e.source;
            if (c.isVisible === true && c.isEnabled === false && this.focusOwner != null) {
                this.$freeFocus(c);
            }
        };

        /**
         * Component shown event handler
         * @param  {zebkit.ui.Panel} c a component
         * @method compShown
         */
        this.compShown = function(e) {
            var c = e.source;
            if (c.isEnabled === true && c.isVisible === false && this.focusOwner != null) {
                this.$freeFocus(c);
            }
        };

        /**
         * Component removed event handler
         * @param  {zebkit.ui.Panel} p a parent
         * @param  {Integer} i      a removed component index
         * @param  {zebkit.ui.Panel} c a removed component
         * @method compRemoved
         */
        this.compRemoved = function(e) {
            var c = e.kid;
            if (c.isEnabled === true && c.isVisible === true && this.focusOwner != null) {
                this.$freeFocus(c);
            }
        };

        /**
         * Test if the given component is a focus owner
         * @param  {zebkit.ui.Panel} c an UI component to be tested
         * @method hasFocus
         * @return {Boolean} true if the given component holds focus
         */
        this.hasFocus = function(c) {
            return this.focusOwner === c;
        };

        /**
         * Key pressed event handler.
         * @param  {zebkit.ui.KeyEvent} e a key event
         * @method keyPressed
         */
        this.keyPressed = function(e){
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
        };

        this.findFocusable = function(c) {
            return (this.isFocusable(c) ? c : this.fd(c, 0, 1));
        };

        /**
         * Test if the given component can catch focus
         * @param  {zebkit.ui.Panel} c an UI component to be tested
         * @method isFocusable
         * @return {Boolean} true if the given component can catch a focus
         */
        this.isFocusable = function(c) {
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
        };

        // looking recursively a focusable component among children components of
        // the given target  starting from the specified by index kid with the
        // given direction (forward or backward lookup)
        this.fd = function(t,index,d) {
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
        };

        // find next focusable component
        // c - component starting from that a next focusable component has to be found
        // d - a direction of next focusable component lookup: 1 (forward) or -1 (backward)
        this.ff = function(c, d){
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
        };

        /**
         * Force to pass a focus to the given UI component
         * @param  {zebkit.ui.Panel} c an UI component to pass a focus
         * @method requestFocus
         */
        this.requestFocus = function(c) {
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
        };

        /**
         * Pointer pressed event handler.
         * @param  {zebkit.ui.PointerEvent} e a pointer event
         * @method pointerPressed
         */
        this.pointerPressed = function(e){
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
        };
    }
]);

/**
 *  Command manager supports short cut keys definition and listening. The shortcuts have to be defined in
 *  zebkit JSON configuration files. There are two sections:

    - **osx** to keep shortcuts for Mac OS X platform
    - **common** to keep shortcuts for all other platforms

 *  The JSON configuration entity has simple structure:


      {
        "common": [
             {
                "command"   : "undo_command",
                "args"      : [ true, "test"],
                "key"       : "Ctrl+z"
             },
             {
                "command" : "redo_command",
                "key"     : "Ctrl+Shift+z"
             },
             ...
        ],
        "osx" : [
             {
                "command"   : "undo_command",
                "args"      : [ true, "test"],
                "key"       : "Cmd+z"
             },
             ...
        ]
      }

 *  The configuration contains list of shortcuts. Every shortcut is bound to a key combination it is triggered.
 *  Every shortcut has a name and an optional list of arguments that have to be passed to a shortcut listener method.
 *  The optional arguments can be used to differentiate two shortcuts that are bound to the same command.
 *
 *  On the component level shortcut commands can be listened by implementing method whose name equals to shortcut name.
 *  Pay attention to catch shortcut command your component has to be focusable and holds focus at the given time.
 *  For instance, to catch "undo_command"  do the following:

        var pan = new zebkit.ui.Panel([
            function redo_command() {
                // handle shortcut here
            },

            // visualize the component gets focus
            function focused() {
                this.$super();
                this.setBackground(this.hasFocus()?"red":null);
            }
        ]);

        // let our panel to hold focus by setting appropriate property
        pan.canHaveFocus = true;


 *  @constructor
 *  @class zebkit.ui.ShortcutManager
 *  @extends {zebkit.ui.Manager}
 */

/**
 * Shortcut event is handled by registering a method handler with events manager. The manager is accessed as
 * "zebkit.ui.events" static variable:

        zebkit.ui.events.bind(function commandFired(c) {
            ...
        });

 * @event shortcut
 * @param {Object} c shortcut command
 *         @param {Array} c.args shortcut arguments list
 *         @param {String} c.command shortcut name
 */
pkg.ShortcutManager = Class(pkg.Manager, [
    function $prototype() {
        /**
         * Key pressed event handler.
         * @param  {zebkit.ui.KeyEvent} e a key event
         * @method keyPressed
         */
        this.keyPressed = function(e) {
            var fo = pkg.focusManager.focusOwner;
            if (fo != null && this.keyCommands[e.code]) {
                var c = this.keyCommands[e.code];
                if (c && c[e.mask] != null) {
                    c = c[e.mask];

                    SHORTCUT_EVENT.source  = fo;
                    SHORTCUT_EVENT.command = c;
                    pkg.events.fireEvent( "commandFired", SHORTCUT_EVENT);

                    if (fo[c.command] != null) {
                        if (c.args && c.args.length > 0) {
                            fo[c.command].apply(fo, c.args);
                        } else {
                            fo[c.command]();
                        }
                    }
                }
            }
        };

        this.$parseKey = function(k) {
            var m = 0, c = 0, r = k.split("+");
            for(var i = 0; i < r.length; i++) {
                var ch = r[i].trim().toUpperCase();
                if (pkg.KeyEvent.hasOwnProperty("M_" + ch)) {
                    m += pkg.KeyEvent["M_" + ch];
                } else {
                    if (pkg.KeyEvent.hasOwnProperty(ch)) {
                        c = pkg.KeyEvent[ch];
                    } else {
                        c = parseInt(ch);
                        if (c == NaN) {
                            throw new Error("Invalid key code : " + ch);
                        }
                    }
                }
            }
            return [m, c];
        };

        this.setCommands = function(commands) {
            for(var i=0; i < commands.length; i++) {
                var c = commands[i],
                    p = this.$parseKey(c.key),
                    v = this.keyCommands[p[1]];

                if (v && v[p[0]]) {
                    throw new Error("Duplicated command: '" + c.command +  "' (" + p +")");
                }

                if (v == null) {
                    v = [];
                }

                v[p[0]] = c;
                this.keyCommands[p[1]] = v;
            }
        };
    },

    function(commands){
        this.$super();
        this.keyCommands = {};
        if (commands != null) {
            pkg.events._.addEvents("commandFired");
            this.setCommands(commands.common);
            if (zebkit.isMacOS === true && commands.osx != null) {
                this.setCommands(commands.osx);
            }
        }
    }
]);

/**
 * Cursor manager class. Allows developers to control pointer cursor type by implementing an own
 * getCursorType method or by specifying a cursor by cursorType field. Imagine an UI component
 * needs to change cursor type. It
 *  can be done by one of the following way:

    - **Implement getCursorType method by the component itself if the cursor type depends on cursor location**

          var p = new zebkit.ui.Panel([
               // implement getCursorType method to set required
               // pointer cursor type
               function getCursorType(target, x, y) {
                   return zebkit.ui.Cursor.WAIT;
               }
          ]);

    - **Define "cursorType" property in component if the cursor type doesn't depend on cursor location **

          var myPanel = new zebkit.ui.Panel();
          ...
          myPanel.cursorType = zebkit.ui.Cursor.WAIT;

 *  @class zebkit.ui.CursorManager
 *  @constructor
 *  @extends {zebkit.ui.Manager}
 */
pkg.CursorManager = Class(pkg.Manager, [
    function $prototype() {
        /**
         * Define pointer moved events handler.
         * @param  {zebkit.ui.PointerEvent} e a pointer event
         * @method pointerMoved
         */
        this.pointerMoved = function(e){
            if (this.$isFunc === true) {
                this.cursorType = this.source.getCursorType(this.source, e.x, e.y);
                this.target.style.cursor = (this.cursorType == null) ? "default"
                                                                     : this.cursorType;
            }
        };

        /**
         * Define pointer entered events handler.
         * @param  {zebkit.ui.PointerEvent} e a pointer event
         * @method pointerEntered
         */
        this.pointerEntered = function(e){
            if (e.source.cursorType != null || e.source.getCursorType != null) {
                this.$isFunc = (e.source.getCursorType != null);
                this.target = e.target;
                this.source = e.source;

                this.cursorType = this.$isFunc === true ? this.source.getCursorType(this.source, e.x, e.y)
                                                        : this.source.cursorType;

                this.target.style.cursor = (this.cursorType == null) ? "default"
                                                                     : this.cursorType;
            }
        };

        /**
         * Define pointer exited events handler.
         * @param  {zebkit.ui.PointerEvent} e a pointer event
         * @method pointerExited
         */
        this.pointerExited  = function(e){
            if (this.source != null) {
                this.cursorType = "default";
                if (this.target.style.cursor != this.cursorType) {
                    this.target.style.cursor = this.cursorType;
                }
                this.source = this.target = null;
                this.$isFunc = false;
            }
        };

        /**
         * Define pointer dragged events handler.
         * @param  {zebkit.ui.PointerEvent} e a pointer event
         * @method pointerDragged
         */
        this.pointerDragged = function(e) {
            if (this.$isFunc === true) {
                this.cursorType = this.source.getCursorType(this.source, e.x, e.y);
                this.target.style.cursor = (this.cursorType == null) ? "default"
                                                                      : this.cursorType;
            }
        };
    },

    function(){
        this.$super();

        /**
         * Current cursor type
         * @attribute cursorType
         * @type {String}
         * @readOnly
         * @default "default"
         */
        this.cursorType = "default";
        this.source = this.target = null;
        this.$isFunc = false;
    }
]);

/**
 * Event manager class. One of the key zebkit manager that is responsible for
 * distributing various events in zebkit UI. The manager provides number of
 * methods to register global events listeners.
 * @class zebkit.ui.EventManager
 * @constructor
 * @extends {zebkit.ui.Manager}
 */
pkg.EventManager = Class(pkg.Manager, [
    function $clazz(argument) {
        var eventNames = [
            'keyTyped',
            'keyReleased',
            'keyPressed',
            'pointerDragged',
            'pointerDragStarted',
            'pointerDragEnded',
            'pointerMoved',
            'pointerClicked',
            'pointerDoubleClicked',
            'pointerPressed',
            'pointerReleased',
            'pointerEntered',
            'pointerExited',

            'focusLost',
            'focusGained',

            'compSized',
            'compMoved',
            'compEnabled',
            'compShown',
            'compAdded',
            'compRemoved',

            'winOpened',
            'winActivated',

            'menuItemSelected'
        ];

        this.$CHILD_EVENTS_MAP = {};

        // add child<eventName> events names
        var l = eventNames.length;
        for(var i = 0; i < l; i++) {
            var eventName = eventNames[i];
            eventNames.push("child" + eventName[0].toUpperCase() + eventName.substring(1));
            this.$CHILD_EVENTS_MAP[eventName] = eventNames[l + i];
        }

        this.Listerners = zebkit.util.ListenersClass.apply(this, eventNames);
    },

    function $prototype(clazz) {
        var $CEM = clazz.$CHILD_EVENTS_MAP;

        this.fireEvent = function(id, e){
            var t = e.source, kk = $CEM[id], b = false;

            // assign id that matches method to be called
            e.id = id;

            // call target component listener
            if (t[id] != null) {
                if (t[id].call(t, e) === true) {
                    return true;
                }
            }

            // call global listeners
            b = this._[id](e);

            // call parent listeners
            if (b === false) {
                for (t = t.parent;t != null; t = t.parent){
                    if (t[kk] != null) {
                        t[kk].call(t, e);
                    }
                }
            }

            return b;
        };
    },

    function() {
        this._ = new this.clazz.Listerners();
        this.$super();
    }
]);

this.events = new pkg.EventManager();

pkg.zCanvas = Class(pkg.HtmlCanvas, [
    function $clazz () {
        this.CLASS_NAME = "zebcanvas";
    },

    function $prototype() {
        this.$isRootCanvas   = true;
        this.isSizeFull      = false;

        this.$toElementX = function(pageX, pageY) {
            pageX -= this.offx;
            pageY -= this.offy;

            var c = this.$context.$states[this.$context.$curState];
            return ((c.sx != 1 || c.sy != 1 || c.rotateVal !== 0) ? Math.round((c.crot * pageX + pageY * c.srot)/c.sx)
                                                                  : pageX) - c.dx;
        };

        this.$toElementY = function(pageX, pageY) {
            pageX -= this.offx;
            pageY -= this.offy;

            var c = this.$context.$states[this.$context.$curState];
            return ((c.sx != 1 || c.sy != 1 || c.rotateVal !== 0) ? Math.round((pageY * c.crot - c.srot * pageX)/c.sy)
                                                                 : pageY) - c.dy;
        };

        this.load = function(jsonPath, cb){
            return this.root.load(jsonPath, cb);
        };

        // TODO: may be rename to dedicated method $doWheelScroll
        this.$doScroll = function(dx, dy, src) {
            if (src === "wheel") {
                var owner = pkg.$pointerOwner.mouse;
                while (owner != null && owner.doScroll == null) {
                    owner = owner.parent;
                }

                if (owner != null) {
                    return owner.doScroll(dx, dy, src);
                }
            }
        };

        this.$keyTyped = function(e) {
            if (pkg.focusManager.focusOwner != null) {
                e.source = pkg.focusManager.focusOwner;
                return pkg.events.fireEvent("keyTyped", e);
            }
            return false;
        };

        this.$keyPressed = function(e) {
            for(var i = this.kids.length - 1;i >= 0; i--){
                var l = this.kids[i];
                if (l.layerKeyPressed != null && l.layerKeyPressed(e) === true) {
                    return true;
                }
            }

            if (pkg.focusManager.focusOwner != null) {
                e.source = pkg.focusManager.focusOwner;
                return pkg.events.fireEvent("keyPressed", e);
            }

            return false;
        };

        this.$keyReleased = function(e){
            if (pkg.focusManager.focusOwner != null) {
                e.source = pkg.focusManager.focusOwner;
                return pkg.events.fireEvent("keyReleased", e);
            }
            return false;
        };

        this.$pointerEntered = function(e) {
            // TODO: review it quick and dirty fix try to track a situation
            //       when the canvas has been moved
            this.recalcOffset();

            var x = this.$toElementX(e.pageX, e.pageY),
                y = this.$toElementY(e.pageX, e.pageY),
                d = this.getComponentAt(x, y),
                o = pkg.$pointerOwner[e.identifier];

            // also correct current component on that  pointer is located
            if (d !== o) {
                // if pointer owner is not null but doesn't match new owner
                // generate pointer exit and clean pointer owner
                if (o != null) {
                    pkg.$pointerOwner[e.identifier] = null;
                    pkg.events.fireEvent("pointerExited", e.update(o, x, y));
                }

                // if new pointer owner is not null and enabled
                // generate pointer entered event ans set new pointer owner
                if (d != null && d.isEnabled === true){
                    pkg.$pointerOwner[e.identifier] = d;
                    pkg.events.fireEvent("pointerEntered", e.update(d, x, y));
                }
            }
        };

        this.$pointerExited = function(e) {
            var o = pkg.$pointerOwner[e.identifier];
            if (o != null) {
                pkg.$pointerOwner[e.identifier] = null;
                return pkg.events.fireEvent("pointerExited", e.update(o,
                                                                      this.$toElementX(e.pageX, e.pageY),
                                                                      this.$toElementY(e.pageX, e.pageY)));
            }
        };

        /**
         * Catch native canvas pointer move events
         * @param {String} id an touch id (for touchable devices)
         * @param {String} e a pointer event that has been triggered by canvas element
         *
         *         {
         *             pageX : {Integer},
         *             pageY : {Integer},
         *             target: {HTMLElement}
         *         }
         * @protected
         * @method $pointerMoved
         */
        this.$pointerMoved = function(e){
            // if a pointer button has not been pressed handle the normal pointer moved event
            var x = this.$toElementX(e.pageX, e.pageY),
                y = this.$toElementY(e.pageX, e.pageY),
                d = this.getComponentAt(x, y),
                o = pkg.$pointerOwner[e.identifier],
                b = false;

            // check if pointer already inside a component
            if (o != null) {
                if (d != o) {
                    pkg.$pointerOwner[e.identifier] = null;
                    b = pkg.events.fireEvent("pointerExited", e.update(o, x, y));

                    if (d != null && d.isEnabled === true) {
                        pkg.$pointerOwner[e.identifier] = d;
                        b = pkg.events.fireEvent("pointerEntered", e.update(d, x, y)) || b;
                    }
                } else {
                    if (d != null && d.isEnabled === true) {
                        b = pkg.events.fireEvent("pointerMoved", e.update(d, x, y));
                    }
                }
            } else {
                if (d != null && d.isEnabled === true) {
                    pkg.$pointerOwner[e.identifier] = d;
                    b = pkg.events.fireEvent("pointerEntered", e.update(d, x, y));
                }
            }

            return b;
        };

        this.$pointerDragStarted = function(e) {
            var x = this.$toElementX(e.pageX, e.pageY),
                y = this.$toElementY(e.pageX, e.pageY),
                d = this.getComponentAt(x, y);

            // if target component can be detected fire pointer start dragging and
            // pointer dragged events to the component
            if (d != null && d.isEnabled === true) {
                return pkg.events.fireEvent("pointerDragStarted", e.update(d, x, y));
            }

            return false;
        };

        this.$pointerDragged = function(e){
            if (pkg.$pointerOwner[e.identifier] != null) {
                return pkg.events.fireEvent("pointerDragged", e.update(pkg.$pointerOwner[e.identifier],
                                                                       this.$toElementX(e.pageX, e.pageY),
                                                                       this.$toElementY(e.pageX, e.pageY)));
            }

            return false;
        };

        this.$pointerDragEnded = function(e) {
            if (pkg.$pointerOwner[e.identifier] != null) {
                return pkg.events.fireEvent("pointerDragEnded", e.update(pkg.$pointerOwner[e.identifier],
                                                                         this.$toElementX(e.pageX, e.pageY),
                                                                         this.$toElementY(e.pageX, e.pageY)));
            }
            return false;
        };

        this.$pointerClicked = function(e) {
            var x = this.$toElementX(e.pageX, e.pageY),
                y = this.$toElementY(e.pageX, e.pageY),
                d = this.getComponentAt(x, y);

            return d != null ? pkg.events.fireEvent("pointerClicked", e.update(d, x, y))
                             : false;
        };

        this.$pointerDoubleClicked = function(e) {
            var x = this.$toElementX(e.pageX, e.pageY),
                y = this.$toElementY(e.pageX, e.pageY),
                d = this.getComponentAt(x, y);

            return d != null ? pkg.events.fireEvent("pointerDoubleClicked", e.update(d, x, y))
                             : false;
        };

        this.$pointerReleased = function(e) {
            var x  = this.$toElementX(e.pageX, e.pageY),
                y  = this.$toElementY(e.pageX, e.pageY),
                pp = pkg.$pointerPressedOwner[e.identifier];

            // release pressed state
            if (pp != null) {
                try {
                    pkg.events.fireEvent("pointerReleased", e.update(pp, x, y));
                } finally {
                    pkg.$pointerPressedOwner[e.identifier] = null;
                }
            }

            // mouse released can happen at new location, so move owner has to be corrected
            // and mouse exited entered event has to be generated.
            // the correction takes effect if we have just completed dragging or mouse pressed
            // event target doesn't match pkg.$pointerOwner
            if (e.pointerType === "mouse" && (e.pressPageX != e.pageX || e.pressPageY != e.pageY)) {
                var nd = this.getComponentAt(x, y),
                    po = this.getComponentAt(this.$toElementX(e.pressPageX, e.pressPageY),
                                             this.$toElementY(e.pressPageX, e.pressPageY));

                if (nd !== po) {
                    if (po != null) {
                        pkg.$pointerOwner[e.identifier] = null;
                        pkg.events.fireEvent("pointerExited", e.update(po, x, y));
                    }

                    if (nd != null && nd.isEnabled === true){
                        pkg.$pointerOwner[e.identifier] = nd;
                        pkg.events.fireEvent("pointerEntered", e.update(nd, x, y));
                    }
                }
            }
        };

        this.$pointerPressed = function(e) {
            var x  = this.$toElementX(e.pageX, e.pageY),
                y  = this.$toElementY(e.pageX, e.pageY),
                pp = pkg.$pointerPressedOwner[e.identifier];

            // free pointer prev presssed if any
            if (pp != null) {
                try {
                    pkg.events.fireEvent("pointerReleased", e.update(pp, x, y));
                } finally {
                    pkg.$pointerPressedOwner[e.identifier] = null;
                }
            }

            // adjust event for passing it to layers
            e.x = x;
            e.y = y;
            e.source = null;

            // send pointer event to a layer and test if it has been activated
            for(var i = this.kids.length - 1; i >= 0; i--){
                var tl = this.kids[i];
                if (tl.layerPointerPressed != null) {
                    e.id = "pointerPressed";
                    if (tl.layerPointerPressed(e) === true) {
                        return true;
                    }
                }
            }

            var d = this.getComponentAt(x, y);

            if (d != null && d.isEnabled === true) {
                if (pkg.$pointerOwner[e.identifier] !== d) {
                    pkg.$pointerOwner[e.identifier] = d;
                    pkg.events.fireEvent("pointerEntered",  e.update(d, x, y));
                }

                pkg.$pointerPressedOwner[e.identifier] = d;

                // TODO: prove the solution (returning true) !?
                if (pkg.events.fireEvent("pointerPressed", e.update(d, x, y)) === true) {
                   delete pkg.$pointerPressedOwner[e.identifier];
                   return true;
                }
            }

            return false;
        };

        this.getComponentAt = function(x, y){
            for(var i = this.kids.length; --i >= 0; ){
                var c = this.kids[i].getComponentAt(x, y);
                if (c != null) {
                    var p = c;
                    while ((p = p.parent) != null) {
                        if (p.catchInput != null && (p.catchInput === true || (p.catchInput !== false && p.catchInput(c)))) {
                            c = p;
                        }
                    }
                    return c;
                }
            }
            return null;
        };

        this.recalcOffset = function() {
            // calculate the DOM element offset relative to window taking in account
            // scrolling
            var poffx = this.offx,
                poffy = this.offy,
                ba    = this.$container.getBoundingClientRect();

            this.offx = Math.round(ba.left) + zebkit.web.$measure(this.$container, "border-left-width") +
                                              zebkit.web.$measure(this.$container, "padding-left") +
                                              window.pageXOffset;
            this.offy = Math.round(ba.top) +  zebkit.web.$measure(this.$container, "padding-top" ) +
                                              zebkit.web.$measure(this.$container, "border-top-width") +
                                              window.pageYOffset;

            if (this.offx != poffx || this.offy != poffy) {
                // force to fire component re-located event
                this.relocated(this, poffx, poffy);
            }
        };

        /**
         * Get the canvas layer by the specified layer ID. Layer is a children component
         * of the canvas UI component. Every layer has an ID assigned to it the method
         * actually allows developers to get the canvas children component by its ID
         * @param  {String} id a layer ID
         * @return {zebkit.ui.Panel} a layer (children) component
         * @method getLayer
         */
        this.getLayer = function(id) {
            return this[id];
        };

        // override relocated and resized
        // to prevent unnecessary repainting
        this.relocated = function(px,py) {
            COMP_EVENT.source = this;
            COMP_EVENT.px     = px;
            COMP_EVENT.py     = py;
            pkg.events.fireEvent("compMoved", COMP_EVENT);
        };

        this.resized = function(pw,ph) {
            COMP_EVENT.source = this;
            COMP_EVENT.prevWidth  = pw;
            COMP_EVENT.prevHeight = ph;
            pkg.events.fireEvent("compSized", COMP_EVENT);
            // don't forget repaint it
            this.repaint();
        };

        this.$initListeners = function() {
            // TODO: hard-coded
            new pkg.PointerEventUnifier(this.$container, this);
            new pkg.KeyEventUnifier(this.element, this); // element has to be used since canvas is
                                                         // styled to have focus and get key events
            new pkg.MouseWheelSupport(this.$container, this);
        };

        this.fullScreen = function() {
            var element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
              } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
              } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
              } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
              }
            //}
        //    document.documentElement.webkitRequestFullscreen();
        };
    },

    function(element, w, h) {
        // no arguments
        if (arguments.length === 0) {
            w = 400;
            h = 400;
        } else {
            if (arguments.length === 1) {
                w = -1;
                h = -1;
            } else {
                if (arguments.length === 2) {
                    h = w;
                    w = element;
                    element = null;
                }
            }
        }

        // if passed element is string than consider it as
        // an ID of an element that is already in DOM tree
        if (zebkit.isString(element)) {
            var id = element;
            element = document.getElementById(id);

            // no canvas can be detected
            if (element == null) {
                throw new Error("Canvas id='" + id + "' element cannot be found");
            }
        }

        this.$super(element);

        // since zCanvas is top level element it doesn't have to have
        // absolute position
        this.$container.style.position = "relative";

        // let canvas zCanvas listen WEB event
        this.$container.style["pointer-events"] = "auto";

        // if canvas is not yet part of HTML let's attach it to
        // body.
        if (this.$container.parentNode == null) {
            document.body.appendChild(this.$container);
        }

        // force canvas to have a focus
        if (this.element.getAttribute("tabindex") === null) {
            this.element.setAttribute("tabindex", "1");
        }

        if (w < 0) w = this.element.offsetWidth;
        if (h < 0) h = this.element.offsetHeight;

        // !!!
        // save canvas in list of created Zebkit canvases
        // do it before calling setSize(w,h) method
        pkg.$canvases.push(this);

        this.setSize(w, h);

        // sync canvas visibility with what canvas style says
        var cvis = (this.element.style.visibility == "hidden" ? false : true);
        if (this.isVisible != cvis) {
            this.setVisible(cvis);
        }

        // call event method if it is defined
        if (this.canvasInitialized != null) {
            this.canvasInitialized();
        }

        var $this = this;

        // this method should clean focus if
        // one of of a child DOM element gets focus
        zebkit.web.$focusin(this.$container, function(e) {
            if (e.target !== $this.$container &&
                e.target.parentNode != null &&
                e.target.parentNode.getAttribute("data-zebcont") == null)
            {
                pkg.focusManager.requestFocus(null);
            } else {
                // clear focus if a focus owner component is placed in another zCanvas
                if (e.target === $this.$container &&
                    pkg.focusManager.focusOwner != null &&
                    pkg.focusManager.focusOwner.getCanvas() !== $this)
                {
                    pkg.focusManager.requestFocus(null);
                }
            }
        }, true);
    },

    function setSize(w, h) {
        if (this.width != w || h != this.height) {
            this.$super(w, h);

            // let know to other zebkit canvases that
            // the size of an element on the page has
            // been updated and they have to correct
            // its anchor.
            pkg.$elBoundsUpdated();
        }
        return this;
    },

    function fullSize() {
        /**
         * Indicate if the canvas has to be stretched to
         * fill the whole screen area.
         * @type {Boolean}
         * @attribute isFullSize
         * @readOnly
         */
        if (this.isFullSize !== true) {
            if (zebkit.web.$contains(this.$container) !== true) {
                throw new Error("zCanvas is not a part of DOM tree");
            }

            this.isFullSize = true;
            this.setLocation(0, 0);

            // adjust body to kill unnecessary gap for inline-block zCanvas element
            // otherwise body size will be slightly horizontally bigger than visual
            // viewport height what causes scroller appears
            document.body.style["font-size"] = "0px";

            var ws = zebkit.web.$viewPortSize();
            this.setSize(ws.width, ws.height);
        }
    },

    function setVisible(b) {
        var prev = this.isVisible;
        this.$super(b);

        // Since zCanvas has no parent component calling the super
        // method above doesn't trigger repainting. So, do it here.
        if (b != prev) {
            this.repaint();
        }
        return this;
    },

    function vrp() {
        this.$super();
        if (zebkit.web.$contains(this.element) && this.element.style.visibility === "visible") {
            this.repaint();
        }
    },

    function kidAdded(i,constr,c){
        if (typeof this[c.id] !== "undefined") {
            throw new Error("Layer '" + c.id + "' already exist");
        }

        this[c.id] = c;
        this.$super(i, constr, c);
    },

    function kidRemoved(i, c){
        delete this[c.id];
        this.$super(i, c);
    }
]);


pkg.HtmlElementMan = Class(pkg.Manager, [
//
// HTML element integrated into zebkit layout has to be tracked regarding:
//    1) DOM hierarchy. New added into zebkit layout DOM element has to be
//       attached to the first found parent DOM element
//    2) Visibility. If a zebkit UI component change its visibility state
//       it has to have side effect to all children HTML elements on any
//       subsequent hierarchy level
//    3) Moving a zebkit UI component has to correct location of children
//       HTML element on any subsequent hierarchy level.
//
//  The implementation of HTML element component has the following specific:
//    1) Every original HTML is wrapped with "div" element. It is necessary since
//       not all HTML element has been designed to be a container for another
//       HTML element. By adding extra div we can consider the wrapper as container.
//       The wrapper element is used to control visibility, location, enabled state
//    2) HTML element has "isDOMElement" property set to true
//    3) HTML element visibility depends on an ancestor component visibility.
//       HTML element is visible if:
//          -- the element isVisible property is true
//          -- the element has a parent DOM element set
//          -- all his ancestors are visible
//          -- size of element is more than zero
//          -- getCanvas() != null
//       The visibility state is controlled with "e.style.visibility"
//
//   To support effective DOM hierarchy tracking a zebkit UI component can
//   host "$domKid" property that contains direct DOM element the UI component
//   hosts and other UI components that host DOM element. So it is sort of tree.
//   For instance:
//
//    +---------------------------------------------------------
//    |  p1 (zebkit component)
//    |   +--------------------------------------------------
//    |   |  p2 (zebkit component)
//    |   |    +---------+      +-----------------------+
//    |   |    |   h1    |      | p3 zebkit component    |
//    |   |    +---------+      |  +---------------+    |
//    |   |                     |  |    h3         |    |
//    |   |    +---------+      |  |  +---------+  |    |
//    |   |    |   h2    |      |  |  |   p4    |  |    |
//    |   |    +---------+      |  |  +---------+  |    |
//    |   |                     |  +---------------+    |
//    |   |                     +-----------------------+
//
//     p1.$domKids : {
//         p2.$domKids : {
//             h1,   // leaf elements are always DOM element
//             h2,
//             p3.$domKids : {
//                h3
//             }
//         }
//     }
    function $prototype() {
        function $isInInvisibleState(c) {
            if (c.isVisible === false           ||
                c.$container.parentNode == null ||
                c.width       <= 0              ||
                c.height      <= 0              ||
                c.parent      == null           ||
                zebkit.web.$contains(c.$container) === false)
            {
                return true;
            }

            var p = c.parent;
            while (p != null && p.isVisible === true && p.width > 0 && p.height > 0) {
                p = p.parent;
            }

            return p != null || pkg.$cvp(c) == null;
        }

        // attach to appropriate DOM parent if necessary
        // c parameter has to be DOM element
        function $resolveDOMParent(c) {
            // try to find an HTML element in zebkit (pay attention, in zebkit hierarchy !)
            // hierarchy that has to be a DOM parent for the given component
            var parentElement = null;
            for(var p = c.parent; p != null; p = p.parent) {
                if (p.isDOMElement === true) {
                    parentElement = p.$container;
                    break;
                }
            }

            // parentElement is null means the component has
            // not been inserted into DOM hierarchy
            if (parentElement != null && c.$container.parentNode == null) {
                // parent DOM element of the component is null, but a DOM container
                // for the element has been detected. We need to add it to DOM
                // than we have to add the DOM to the found DOM parent element
                parentElement.appendChild(c.$container);

                // adjust location of just attached DOM component
                $adjustLocation(c);
            } else {
                // test consistency whether the DOM element already has
                // parent node that doesn't match the discovered
                if (parentElement           != null &&
                    c.$container.parentNode != null &&
                    c.$container.parentNode !== parentElement)
                {
                    throw new Error("DOM parent inconsistent state ");
                }
            }
        }

        //    +----------------------------------------
        //    |             ^      DOM1
        //    |             .
        //    |             .  (x,y) -> (xx,yy) than correct left
        //                  .  and top of DOM2 relatively to DOM1
        //    |    +--------.--------------------------
        //    |    |        .       zebkit1
        //    |    |        .
        //    |    |  (left, top)
        //    |<............+-------------------------
        //    |    |        |           DOM2
        //    |    |        |
        //
        //  Convert DOM (x, y) zebkit coordinates into appropriate CSS top and left
        //  locations relatively to its immediate DOM element. For instance if a
        //  zebkit component contains DOM component every movement of zebkit component
        //  has to bring to correction of the embedded DOM elements
        function $adjustLocation(c) {
            if (c.$container.parentNode != null) {
                // hide DOM component before move
                // makes moving more smooth
                var prevVisibility = c.$container.style.visibility;
                c.$container.style.visibility = "hidden";

                // find a location relatively to the first parent HTML element
                var p = c, xx = c.x, yy = c.y;
                while (((p = p.parent) != null) && p.isDOMElement !== true) {
                    xx += p.x;
                    yy += p.y;
                }

                c.$container.style.left = "" + xx + "px";
                c.$container.style.top  = "" + yy + "px";
                c.$container.style.visibility = prevVisibility;
            }
        }

        // iterate over all found children HTML elements
        // !!! pay attention you have to check existence
        // of "$domKids" field before the method calling
        function $domElements(c, callback) {
            for (var k in c.$domKids) {
                var e = c.$domKids[k];
                if (e.isDOMElement === true) {
                    callback.call(this, e);
                } else {
                    // prevent unnecessary method call by condition
                    if (e.$domKids != null) {
                        $domElements(e, callback);
                    }
                }
            }
        }

        this.compShown = function(e) {
            // 1) if c is DOM element than we have make it is visible if
            //      -- c.isVisible == true : the component visible  AND
            //      -- all elements in parent chain is visible      AND
            //      -- the component is in visible area
            //
            // 2) if c is not a DOM component his visibility state can have
            //    side effect to his children HTML elements (on any level)
            //    In this case we have to do the following:
            //      -- go through all children HTML elements
            //      -- if c.isVisible == false: make invisible every children element
            //      -- if c.isVisible != false: make visible every children element whose
            //         visibility state satisfies the following conditions:
            //          -- kid.isVisible == true
            //          -- all parent to c are in visible state
            //          -- the kid component is in visible area
            var c = e.source;
            if (c.isDOMElement === true) {
                c.$container.style.visibility = c.isVisible === false || $isInInvisibleState(c) ? "hidden"
                                                                                                : "visible";
            } else {
                if (c.$domKids != null) {
                    $domElements(c, function(e) {
                        e.$container.style.visibility = e.isVisible === false || $isInInvisibleState(e) ? "hidden" : "visible";
                    });
                }
            }
        };

        this.compMoved = function(e) {
            var c = e.source;

            // if we move a zebkit component that contains
            // DOM element(s) we have to correct the DOM elements
            // locations relatively to its parent DOM
            if (c.isDOMElement === true) {
                // root canvas location cannot be adjusted since it is up to DOM tree to do it
                if (c.$isRootCanvas !== true) {
                    var dx   = e.prevX - c.x,
                        dy   = e.prevY - c.y,
                        cont = c.$container;

                    cont.style.left = ((parseInt(cont.style.left, 10) || 0) - dx) + "px";
                    cont.style.top  = ((parseInt(cont.style.top,  10) || 0) - dy) + "px";
                }
            } else {
                if (c.$domKids != null) {
                    $domElements(c, function(e) {
                        $adjustLocation(e);
                    });
                }
            }
        };

        function detachFromParent(p, c) {
            // DOM parent means the detached element doesn't
            // have upper parents since it is relative to the
            // DOM element
            if (p.isDOMElement !== true && p.$domKids != null) {
                // delete from parent
                delete p.$domKids[c];

                // parent is not DOM and doesn't have kids anymore
                // what means the parent has to be also detached
                if (isLeaf(p)) {
                    // parent of parent is not null and is not a DOM element
                    if (p.parent != null && p.parent.isDOMElement !== true) {
                        detachFromParent(p.parent, p);
                    }

                    // remove $domKids from parent since the parent is leaf
                    delete p.$domKids;
                }
            }
        }

        function isLeaf(c) {
            if (c.$domKids != null) {
                for(var k in c.$domKids) {
                    if (c.$domKids.hasOwnProperty(k)) return false;
                }
            }
            return true;
        }

        function removeDOMChildren(c) {
            // DOM element cannot have children dependency tree
            if (c.isDOMElement !== true && c.$domKids != null) {
                for(var k in c.$domKids) {
                    if (c.$domKids.hasOwnProperty(k)) {
                        var kid = c.$domKids[k];

                        // DOM element
                        if (kid.isDOMElement === true) {
                            kid.$container.parentNode.removeChild(kid.$container);
                            kid.$container.parentNode = null;
                        } else {
                            removeDOMChildren(kid);
                        }
                    }
                }
                delete c.$domKids;
            }
        }

        this.compRemoved = function(e) {
            var c = e.kid;

            // if detached element is DOM element we have to
            // remove it from DOM tree
            if (c.isDOMElement === true) {
                c.$container.parentNode.removeChild(c.$container);
                c.$container.parentNode = null;
            } else {
                removeDOMChildren(c);
            }

            detachFromParent(e.source, c);
        };

        this.compAdded = function(e) {
            var p = e.source,  c = e.kid;
            if (c.isDOMElement === true) {
                $resolveDOMParent(c);
            } else {
                if (c.$domKids != null) {
                    $domElements(c, function(e) {
                        $resolveDOMParent(e);
                    });
                } else {
                    return;
                }
            }

            if (p.isDOMElement !== true) {
                // we come here if parent is not a DOM element and
                // inserted children is DOM element or an element that
                // embeds DOM elements
                while (p != null && p.isDOMElement !== true) {
                    if (p.$domKids == null) {
                        // if reference to kid DOM element or kid DOM elements holder
                        // has bot been created we have to continue go up to parent of
                        // the parent to register the whole chain of DOM and DOM holders
                        p.$domKids = {};
                        p.$domKids[c] = c;
                        c = p;
                        p = p.parent;
                    } else {
                        if (p.$domKids.hasOwnProperty(c)) {
                            throw new Error("Inconsistent state for " + c + ", " + c.clazz.$name);
                        }
                        p.$domKids[c] = c;
                        break;
                    }
                }
            }
        };
    }
]);

});