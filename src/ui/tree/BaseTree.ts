import Panel from '../ui/Panel';

/**
 * Abstract tree component that can used as basement for building own tree components.
 * The component is responsible for rendering tree, calculating tree nodes metrics,
 * computing visible area, organizing basic user interaction. Classes that inherit it
 * has to provide the following important things:

    * **A tree model item metric** Developers have to implement "getItemPreferredSize(item)"
      method to say which size the given tree item wants to have.
    * **Tree node item rendering** If necessary developers have to implement the way
      a tree item has to be visualized by implementing "this.paintItem(...)" method

 *
 * @class zebkit.ui.tree.BaseTree
 * @constructor
 * @param {zebkit.data.TreeModel|Object} a tree model. It can be an instance of tree model
 * class or an object that described tree model. An example of such object is shown below:

        {
            value : "Root",
            kids  : [
                {
                    value: "Child 1",
                    kids :[
                        "Sub child 1"
                    ]
                },
                "Child 2",
                "Child 3"
            ]
        }

 * @param {Boolean} [nodeState] a default tree nodes state (expanded or collapsed)
 * @extends {zebkit.ui.Panel}
 */

 /**
  * Fired when a tree item has been toggled

        tree.bind(function toggled(src, item) {
           ...
        });

  * @event toggled
  * @param  {zebkit.ui.tree.BaseTree} src a tree component that triggers the event
  * @param  {zebkit.data.Item} item an tree item that has been toggled
  */

 /**
  * Fired when a tree item has been selected

      tree.bind(function selected(src, prevItem) {
         ...
      });

  * @event selected
  * @param  {zebkit.ui.tree.BaseTree} src a tree component that triggers the event
  * @param  {zebkit.data.Item} prevItem a previously selected tree item
  */


/**
  * Fired when a tree item editing has been started

      tree.bind(function editingStarted(src, item, editor) {
         ...
      });

  * @event editingStarted
  * @param  {zebkit.ui.tree.BaseTree} src an tree component that triggers the event
  * @param  {zebkit.data.Item} item a tree item to be edited
  * @param  {zebkit.ui.Panel} editor an editor to be used to edit the given item
  */

/**
  * Fired when a tree item editing has been stopped

      tree.bind(function editingStopped(src, item, oldValue, editor, isApplied) {
         ...
      });

  * @event editingStopped
  * @param  {zebkit.ui.tree.BaseTree} src a tree component that triggers the event
  * @param  {zebkit.data.Item} item a tree item that has been edited
  * @param  {Object} oldValue an old value of the edited tree item
  * @param  {zebkit.ui.Panel} editor an editor to be used to edit the given item
  * @param  {Boolean} isApplied flag that indicates if the edited value has been
  * applied to the given tree item
  */
import { ListenersClass } from '../../utils/listen';

export default class BaseTree extends Panel {
    get clazz() {
        return {
            Listeners: ListenersClass("toggled", "selected", "editingStarted", "editingStopped");
        }        
    }

    gapx: number; 
    gapy: number;
    canHaveFocus: boolean;

    // this.selected = this.firstVisible = null;
    // this.maxw = this.maxh = 0;
    // this.selected = this.firstVisible = null;
    // this.maxw = this.maxh = 0;
    // this.selected = this.firstVisible = null;
    // this.maxw = this.maxh = 0;
    // this.visibleArea = this.lnColor = null;

    // this.views     = {};
    // this.viewSizes = {};

    // this._isVal = false;
    // this.nodes = {};
    // this._ = new this.clazz.Listeners();
    // this.setLineColor("gray");

    // this.isOpenVal = b;

    // this.setSelectable(true);
    // this.$super();
    // this.setModel(d);
    // this.scrollManager = new ui.ScrollManager(this);


    constructor(d, b?){
        super();

        if (arguments.length < 2) {
            b = true;
        }

        /**
         * Horizontal gap between a node elements: toggle, icons and tree item view
         * @attribute gapx
         * @readOnly
         * @default 2
         * @type {Integer}
         */

        /**
         * Vertical gap between a node elements: toggle, icons and tree item view
         * @attribute gapy
         * @readOnly
         * @default 2
         * @type {Integer}
         */

        this.gapx = this.gapy = 2;
        this.canHaveFocus = true;

         /**
          * Selected tree model item
          * @attribute selected
          * @type {zebkit.data.Item}
          * @default null
          * @readOnly
          */

        this.selected = this.firstVisible = null;
        this.maxw = this.maxh = 0;

         /**
          * Tree component line color
          * @attribute lnColor
          * @type {String}
          * @readOnly
          */

        this.visibleArea = this.lnColor = null;

        this.views     = {};
        this.viewSizes = {};

        this._isVal = false;
        this.nodes = {};
        this._ = new this.clazz.Listeners();
        this.setLineColor("gray");

        this.isOpenVal = b;

        this.setSelectable(true);
        this.setModel(d);
        this.scrollManager = new ui.ScrollManager(this);
    }

    /**
     * Test if the given tree component item is opened
     * @param  {zebkit.data.Item}  i a tree model item
     * @return {Boolean} true if the given tree component item is opened
     * @method isOpen
     */
    this.isOpen = function(i){
        this.validate();
        return this.isOpen_(i);
    };

    /**
     * Get calculated for the given tree model item metrics
     * @param  {zebkit.data.Item} i a tree item
     * @return {Object}   an tree model item metrics. Th
     * @method getItemMetrics
     */
    this.getItemMetrics = function(i){
        this.validate();
        return this.getIM(i);
    };

    this.togglePressed = function(root) {
        this.toggle(root);
    };

    this.itemPressed = function(root, e) {
        this.select(root);
    };

    this.pointerPressed = function(e){
        if (this.firstVisible != null && e.isAction()) {
            var x = e.x,
                y = e.y,
                root = this.getItemAt(this.firstVisible, x, y);

            if (root != null) {
                x -= this.scrollManager.getSX();
                y -= this.scrollManager.getSY();
                var r = this.getToggleBounds(root);

                if (x >= r.x && x < r.x + r.width && y >= r.y && y < r.y + r.height){
                    this.togglePressed(root);
                } else {
                    if (x > r.x + r.width) this.itemPressed(root, e);
                }
            }
        }
    };

    this.vVisibility = function (){
        if (this.model == null) this.firstVisible = null;
        else {
            var nva = ui.$cvp(this, {});
            if (nva == null) {
                this.firstVisible = null;
            } else {
                if (this._isVal === false ||
                    (this.visibleArea == null              ||
                        this.visibleArea.x != nva.x           ||
                        this.visibleArea.y != nva.y           ||
                        this.visibleArea.width != nva.width   ||
                        this.visibleArea.height != nva.height   ))
                {
                    this.visibleArea = nva;
                    if (this.firstVisible != null) {
                        this.firstVisible = this.findOpened(this.firstVisible);
                        this.firstVisible = this.isOverVisibleArea(this.firstVisible) ? this.nextVisible(this.firstVisible)
                                                                                        : this.prevVisible(this.firstVisible);
                    } else {
                        this.firstVisible = (-this.scrollManager.getSY() > Math.floor(this.maxh / 2)) ? this.prevVisible(this.findLast(this.model.root))
                                                                                                        : this.nextVisible(this.model.root);
                    }
                }
            }
        }
        this._isVal = true;
    };

    this.recalc = function() {
        this.maxh = this.maxw = 0;
        if (this.model != null && this.model.root != null) {
            this.recalc_(this.getLeft(), this.getTop(), null, this.model.root, true);
            this.maxw -= this.getLeft();
            this.maxh -= this.gapy;
        }
    };

    /**
     * Get tree model item  metrical bounds (location and size).
     * @param  {zebkit.data.Item} root an tree model item
     * @return {Object} a structure that keeps an item view location
     * and size:

            {
                x: {Integer},
                y: {Integer},
                width: {Integer},
                height: {Integer}
            }

        * @method getItemBounds
        * @protected
        */
    this.getItemBounds = function(root){
        var metrics = this.getIM(root),
            toggle  = this.getToggleBounds(root),
            image   = this.getIconBounds(root);

        toggle.x = image.x + image.width + (image.width > 0 || toggle.width > 0 ? this.gapx : 0);
        toggle.y = metrics.y + Math.floor((metrics.height - metrics.viewHeight) / 2);
        toggle.width = metrics.viewWidth;
        toggle.height = metrics.viewHeight;
        return toggle;
    };

    /**
     * Get toggle element bounds for the given tree model item.
     * @param  {zebkit.data.Item} root an tree model item
     * @return {Object} a structure that keeps an item toggle location
     * and size:

            {
                x: {Integer},
                y: {Integer},
                width: {Integer},
                height: {Integer}
            }

        * @method getToggleBounds
        * @protected
        */
    this.getToggleBounds = function(root){
        var node = this.getIM(root), d = this.getToggleSize(root);
        return { x     : node.x,
                    y     : node.y + Math.floor((node.height - d.height) / 2),
                    width : d.width,
                    height: d.height };
    };

    /**
     * Get current toggle element view. The view depends on the state of tree item.
     * @param  {zebkit.data.Item} i a tree model item
     * @protected
     * @return {zebkit.ui.View}  a toggle element view
     * @method getToogleView
     */
    this.getToggleView = function(i){
        return i.kids.length > 0 ? (this.getIM(i).isOpen ? this.views.on
                                                            : this.views.off) : null;
    };

    /**
     * An abstract method that a concrete tree component implementations have to
     * override. The method has to return a preferred size the given tree model
     * item wants to have.
     * @param  {zebkit.data.Item} root an tree model item
     * @return {Object} a structure that keeps an item preferred size:

            {
                width: {Integer},
                height: {Integer}
            }

        * @method getItemPreferredSize
        * @protected
        */
    this.getItemPreferredSize = function(root) {
        throw new Error("Not implemented");
    };

    /**
     * An abstract method that a concrete tree component implementations should
     * override. The method has to render the given tree node of the specified
     * tree model item at the given location
     * @param  {2DContext} g a graphical context
     * @param  {zebkit.data.Item} root a tree model item to be rendered
     * @param  {zebkit.ui.tree.$IM} node a tree node metrics
     * @param  {Ineteger} x a x location where the tree node has to be rendered
     * @param  {Ineteger} y a y location where the tree node has to be rendered
     * @method paintItem
     * @protected
     */
    this.recalc_ = function (x,y,parent,root,isVis){
        var node = this.getIM(root);
        if (isVis === true) {
            if (node.viewWidth < 0) {
                var viewSize = this.getItemPreferredSize(root);
                node.viewWidth  = viewSize.width;
                node.viewHeight = viewSize.height;
            }

            var imageSize = this.getIconSize(root), toggleSize = this.getToggleSize(root);
            if (parent != null){
                var pImg = this.getIconBounds(parent);
                x = pImg.x + Math.floor((pImg.width - toggleSize.width) / 2);
            }

            node.x = x;
            node.y = y;
            node.width = toggleSize.width + imageSize.width +
                            node.viewWidth + (toggleSize.width > 0 ? this.gapx : 0) + 10 +
                                            (imageSize.width  > 0 ? this.gapx : 0);

            node.height = Math.max(((toggleSize.height > imageSize.height) ? toggleSize.height
                                                                            : imageSize.height),
                                    node.viewHeight);

            if (node.x + node.width > this.maxw) {
                this.maxw = node.x + node.width;
            }

            this.maxh += (node.height + this.gapy);
            x = node.x + toggleSize.width + (toggleSize.width > 0 ? this.gapx : 0);
            y += (node.height + this.gapy);
        }

        var b = node.isOpen && isVis === true;
        if (b) {
            var count = root.kids.length;
            for(var i = 0; i < count; i++) {
                y = this.recalc_(x, y, root, root.kids[i], b);
            }
        }
        return y;
    };

    this.isOpen_ = function (i){
        return i == null || (i.kids.length > 0 && this.getIM(i).isOpen && this.isOpen_(i.parent));
    };

    /**
     * Get a tree node metrics by the given tree model item.
     * @param  {zebkit.data.Item} i a tree model item
     * @return {zebkit.ui.tree.$IM} a tree node metrics
     * @protected
     * @method getIM
     */
    this.getIM = function (i){
        var node = this.nodes[i];
        if (typeof node === 'undefined'){
            node = new pkg.$IM(this.isOpenVal);
            this.nodes[i] = node;
        }
        return node;
    };

    /**
     * Get a tree item that is located at the given location.
     * @param  {zebkit.data.Item} [root] a starting tree node
     * @param  {Integer} x a x coordinate
     * @param  {Integer} y a y coordinate
     * @return {zebkit.data.Item} a tree model item
     * @method getItemAt
     */
    this.getItemAt = function(root, x, y){
        this.validate();

        if (arguments.length < 3) {
            x = arguments[0];
            y = arguments[1];
            root = this.model.root;
        }

        if (this.firstVisible != null && y >= this.visibleArea.y && y < this.visibleArea.y + this.visibleArea.height){
            var dx    = this.scrollManager.getSX(),
                dy    = this.scrollManager.getSY(),
                found = this.getItemAtInBranch(root, x - dx, y - dy);

            if (found != null) return found;

            var parent = root.parent;
            while (parent != null) {
                var count = parent.kids.length;
                for(var i = parent.kids.indexOf(root) + 1;i < count; i ++ ){
                    found = this.getItemAtInBranch(parent.kids[i], x - dx, y - dy);
                    if (found != null) return found;
                }
                root = parent;
                parent = root.parent;
            }
        }
        return null;
    };

    this.getItemAtInBranch = function(root,x,y){
        if (root != null){
            var node = this.getIM(root);
            if (x >= node.x && y >= node.y && x < node.x + node.width && y < node.y + node.height + this.gapy) {
                return root;
            }

            if (this.isOpen_(root)){
                for(var i = 0;i < root.kids.length; i++) {
                    var res = this.getItemAtInBranch(root.kids[i], x, y);
                    if (res != null) return res;
                }
            }
        }
        return null;
    };

    this.getIconView = function (i){
        return i.kids.length > 0 ? (this.getIM(i).isOpen ? this.views.open
                                                            : this.views.close)
                                    : this.views.leaf;
    };

    this.getIconSize = function (i) {
        var v = i.kids.length > 0 ? (this.getIM(i).isOpen ? this.viewSizes.open
                                                            : this.viewSizes.close)
                                    : this.viewSizes.leaf;
        return v != null ? v : { width:0, height:0 };
    };

    /**
     * Get icon element bounds for the given tree model item.
     * @param  {zebkit.data.Item} root an tree model item
     * @return {Object} a structure that keeps an item icon location
     * and size:

            {
                x: {Integer},
                y: {Integer},
                width: {Integer},
                height: {Integer}
            }

        * @method getToggleBounds
        * @protected
        */
    this.getIconBounds = function(root) {
        var node = this.getIM(root),
            id   = this.getIconSize(root),
            td   = this.getToggleSize(root);
        return { x:node.x + td.width + (td.width > 0 ? this.gapx : 0),
                    y:node.y + Math.floor((node.height - id.height) / 2),
                    width:id.width, height:id.height };
    };

    this.getToggleSize = function(i) {
        return this.isOpen_(i) ? this.viewSizes.on : this.viewSizes.off;
    };

    this.isOverVisibleArea = function (i) {
        var node = this.getIM(i);
        return node.y + node.height + this.scrollManager.getSY() < this.visibleArea.y;
    };

    this.findOpened = function(item) {
        var parent = item.parent;
        return (parent == null || this.isOpen_(parent)) ? item : this.findOpened(parent);
    };

    this.findNext = function(item) {
        if (item != null){
            if (item.kids.length > 0 && this.isOpen_(item)){
                return item.kids[0];
            }
            var parent = null;
            while ((parent = item.parent) != null){
                var index = parent.kids.indexOf(item);
                if (index + 1 < parent.kids.length) return parent.kids[index + 1];
                item = parent;
            }
        }
        return null;
    };

    this.findPrev = function (item){
        if (item != null) {
            var parent = item.parent;
            if (parent != null) {
                var index = parent.kids.indexOf(item);
                return (index - 1 >= 0) ? this.findLast(parent.kids[index - 1]) : parent;
            }
        }
        return null;
    };

    this.findLast = function (item){
        return this.isOpen_(item) && item.kids.length > 0 ? this.findLast(item.kids[item.kids.length - 1])
                                                            : item;
    };

    this.prevVisible = function (item){
        if (item == null || this.isOverVisibleArea(item)) return this.nextVisible(item);
        var parent = null;
        while((parent = item.parent) != null){
            for(var i = parent.kids.indexOf(item) - 1;i >= 0; i-- ){
                var child = parent.kids[i];
                if (this.isOverVisibleArea(child)) return this.nextVisible(child);
            }
            item = parent;
        }
        return item;
    };

    this.isVerVisible = function (item){
        if (this.visibleArea == null) return false;

        var node = this.getIM(item),
            yy1  = node.y + this.scrollManager.getSY(),
            yy2  = yy1 + node.height - 1,
            by   = this.visibleArea.y + this.visibleArea.height;

        return ((this.visibleArea.y <= yy1 && yy1 < by) ||
                (this.visibleArea.y <= yy2 && yy2 < by) ||
                (this.visibleArea.y > yy1 && yy2 >= by)    );
    };

    this.nextVisible = function(item){
        if (item == null || this.isVerVisible(item)) return item;
        var res = this.nextVisibleInBranch(item), parent = null;
        if (res != null) return res;
        while((parent = item.parent) != null){
            var count = parent.kids.length;
            for(var i = parent.kids.indexOf(item) + 1;i < count; i++){
                res = this.nextVisibleInBranch(parent.kids[i]);
                if (res != null) return res;
            }
            item = parent;
        }
        return null;
    };

    this.nextVisibleInBranch = function (item){
        if (this.isVerVisible(item)) return item;
        if (this.isOpen_(item)){
            for(var i = 0;i < item.kids.length; i++){
                var res = this.nextVisibleInBranch(item.kids[i]);
                if (res != null) return res;
            }
        }
        return null;
    };

    this.paintSelectedItem = function(g, root, node, x, y) {
        var v = this.hasFocus() ? this.views.aselect : this.views.iselect;
        if (v != null) {
            v.paint(g, x, y, node.viewWidth, node.viewHeight, this);
        }
    };

    this.paintTree = function (g,item){
        this.paintBranch(g, item);
        var parent = null;
        while((parent = item.parent) != null){
            this.paintChild(g, parent, parent.kids.indexOf(item) + 1);
            item = parent;
        }
    };

    this.paintBranch = function (g, root){
        if (root == null) return false;

        var node = this.getIM(root),
            dx   = this.scrollManager.getSX(),
            dy   = this.scrollManager.getSY();

        if (zebkit.util.isIntersect(node.x + dx, node.y + dy,
                                    node.width, node.height,
                                    this.visibleArea.x, this.visibleArea.y,
                                    this.visibleArea.width, this.visibleArea.height))
        {
            var toggle     = this.getToggleBounds(root),
                toggleView = this.getToggleView(root),
                image      = this.getIconBounds(root),
                vx         = image.x + image.width + this.gapx,
                vy         = node.y + Math.floor((node.height - node.viewHeight) / 2);

            if (toggleView != null) {
                toggleView.paint(g, toggle.x, toggle.y, toggle.width, toggle.height, this);
            }

            if (image.width > 0) {
                this.getIconView(root).paint(g, image.x, image.y,
                                                image.width, image.height, this);
            }

            if (this.selected == root){
                this.paintSelectedItem(g, root, node, vx, vy);
            }

            if (this.paintItem != null) {
                this.paintItem(g, root, node, vx, vy);
            }

            if (this.lnColor != null){
                g.setColor(this.lnColor);
                var yy = toggle.y + Math.floor(toggle.height / 2) + 0.5;

                g.beginPath();
                g.moveTo(toggle.x + (toggleView == null ? Math.floor(toggle.width / 2)
                                                        : toggle.width - 1), yy);
                g.lineTo(image.x, yy);
                g.stroke();
            }
        } else {
            if (node.y + dy > this.visibleArea.y + this.visibleArea.height ||
                node.x + dx > this.visibleArea.x + this.visibleArea.width    )
            {
                return false;
            }
        }
        return this.paintChild(g, root, 0);
    };

    this.y_ = function (item, isStart){
        var node = this.getIM(item),
            th = this.getToggleSize(item).height,
            ty = node.y + Math.floor((node.height - th) / 2),
            dy = this.scrollManager.getSY(),
            y  = (item.kids.length > 0) ? (isStart ? ty + th : ty - 1)
                                        : ty + Math.floor(th / 2);

        return (y + dy < 0) ?  -dy - 1
                            : ((y + dy > this.height) ? this.height - dy : y);
    };

    /**
     * Paint children items of the given root tree item.
     * @param  {2DContext} g a graphical context
     * @param  {zebkit.data.Item} root a root tree item
     * @param  {Integer} index an index
     * @return {Boolean}
     * @protected
     * @method paintChild
     */
    this.paintChild = function (g, root, index){
        var b = this.isOpen_(root);
        if (root === this.firstVisible && this.lnColor != null) {
            g.setColor(this.lnColor);
            var xx = this.getIM(root).x + Math.floor((b ? this.viewSizes.on.width
                                                        : this.viewSizes.off.width) / 2);
            g.beginPath();
            g.moveTo(xx + 0.5, this.getTop());
            g.lineTo(xx + 0.5, this.y_(root, false));
            g.stroke();
        }
        if (b && root.kids.length > 0){
            var firstChild = root.kids[0];
            if (firstChild == null) return true;

            var x = this.getIM(firstChild).x + Math.floor((this.isOpen_(firstChild) ? this.viewSizes.on.width
                                                                                    : this.viewSizes.off.width) / 2),
            count = root.kids.length;
            if (index < count) {
                var  node = this.getIM(root),
                        y    = (index > 0) ? this.y_(root.kids[index - 1], true)
                                        : node.y + Math.floor((node.height + this.getIconSize(root).height) / 2);

                for(var i = index;i < count; i ++ ){
                    var child = root.kids[i];
                    if (this.lnColor != null){
                        g.setColor(this.lnColor);
                        g.beginPath();
                        g.moveTo(x + 0.5, y);
                        g.lineTo(x + 0.5, this.y_(child, false));
                        g.stroke();
                        y = this.y_(child, true);
                    }
                    if (this.paintBranch(g, child) === false){
                        if (this.lnColor != null && i + 1 !== count){
                            g.setColor(this.lnColor);
                            g.beginPath();
                            g.moveTo(x + 0.5, y);
                            g.lineTo(x + 0.5, this.height - this.scrollManager.getSY());
                            g.stroke();
                        }
                        return false;
                    }
                }
            }
        }
        return true;
    };

    this.nextPage = function (item,dir){
        var sum = 0, prev = item;
        while(item != null && sum < this.visibleArea.height){
            sum += (this.getIM(item).height + this.gapy);
            prev = item;
            item = dir < 0 ? this.findPrev(item) : this.findNext(item);
        }
        return prev;
    };

    this.paint = function(g){
        if (this.model != null){
            this.vVisibility();
            if (this.firstVisible != null){
                var sx = this.scrollManager.getSX(), sy = this.scrollManager.getSY();
                try {
                    g.translate(sx, sy);
                    this.paintTree(g, this.firstVisible);
                    g.translate(-sx,  -sy);
                }
                catch(e) {
                    g.translate(-sx,  -sy);
                    throw e;
                }
            }
        }
    };

    /**
     * Select the given item.
     * @param  {zebkit.data.Item} an item to be selected. Use null value to clear any selection
     * @method  select
     */
    this.select = function(item){
        if (this.isSelectable === true){
            var old = this.selected;

            this.selected = item;
            if (this.selected != null) {
                this.makeVisible(this.selected);
            }

            this._.selected(this, old);

            if (old != null && this.isVerVisible(old)) {
                var m = this.getItemMetrics(old);
                this.repaint(m.x + this.scrollManager.getSX(),
                                m.y + this.scrollManager.getSY(),
                                m.width, m.height);
            }

            if (this.selected != null && this.isVerVisible(this.selected)) {
                var m = this.getItemMetrics(this.selected);

                console.log("select -> repaint() " + m.x + "," + m.y + ", " + this.scrollManager.getSX() + "," + this.scrollManager.getSY() + "," + m.width + "," + m.height) ;

                this.repaint(m.x + this.scrollManager.getSX(),
                                m.y + this.scrollManager.getSY(),
                                m.width, m.height);
            }
        }
    };

    /**
     * Make the given tree item visible. Tree component rendered content can takes more space than
     * the UI component size is. In this case the content can be scrolled to make visible required
     * tree item.
     * @param  {zebkit.data.Item} item an item to be visible
     * @method makeVisible
     */
    this.makeVisible = function(item){
        this.validate();
        var r = this.getItemBounds(item);
        this.scrollManager.makeVisible(r.x, r.y, r.width, r.height);
    };

    /**
     * Toggle off or on recursively all items of the given item
     * @param  {zebkit.data.Item} root a starting item to toggle
     * @param  {Boolean} b  true if all items have to be in opened
     * state and false otherwise
     * @method toggleAll
     */
    this.toggleAll = function (root,b){
        var model = this.model;
        if (root.kids.length > 0){
            if (this.getItemMetrics(root).isOpen != b) this.toggle(root);
            for(var i = 0; i < root.kids.length; i++ ){
                this.toggleAll(root.kids[i], b);
            }
        }
    };

    /**
     * Toggle the given tree item
     * @param  {zebkit.data.Item} item an item to be toggled
     * @method toggle
     */
    this.toggle = function(item){
        if (item.kids.length > 0){
            this.validate();
            var node = this.getIM(item);
            node.isOpen = (node.isOpen ? false : true);
            this.invalidate();
            this._.toggled(this, item);
            if( !node.isOpen && this.selected != null){
                var parent = this.selected;
                do {
                    parent = parent.parent;
                }
                while (parent !== item && parent != null);
                if (parent === item) this.select(item);
            }

            this.repaint();
        }
    };

    this.itemInserted = function (model,item){
        this.vrp();
    };

    this.itemRemoved = function (model,item){
        if (item === this.firstVisible) {
            this.firstVisible = null;
        }

        if (item === this.selected) {
            this.select(null);
        }

        delete this.nodes[item];
        this.vrp();
    };

    this.itemModified = function (model,item){
        var node = this.getIM(item);
        // invalidate an item metrics
        if (node != null) {
            node.viewWidth = -1;
        }
        this.vrp();
    };

    this.calcPreferredSize = function (target){
        return this.model == null ? { width:0, height:0 }
                                    : { width:this.maxw, height:this.maxh };
    };

    // static


    function focused(){
        this.$super();
        if (this.selected != null) {
            var m = this.getItemMetrics(this.selected);
            this.repaint(m.x + this.scrollManager.getSX(),
                         m.y + this.scrollManager.getSY(), m.width, m.height);
        }
    },
    /**
     * Say if items of the tree component should be selectable
     * @param {Boolean} b true is tree component items can be selected
     * @method setSelectable
     */
    function setSelectable(b){
        if (this.isSelectable != b){
            if (b === false && this.selected != null) this.select(null);
            this.isSelectable = b;
            this.repaint();
        }
        return this;
    },

    /**
     * Set tree component connector lines color
     * @param {String} c a color
     * @method setLineColor
     */
    function setLineColor(c){
        this.lnColor = c;
        this.repaint();
        return this;
    },

    /**
     * Set the given horizontal gaps between tree node graphical elements:
     * toggle, icon, item view
     * @param {Integer} gx horizontal gap
     * @param {Integer} gy vertical gap
     * @method setGaps
     */
    function setGaps(gx, gy){
        if (gx != this.gapx || gy != this.gapy){
            this.gapx = gx;
            this.gapy = gy;
            this.vrp();
        }
        return this;
    },

    /**
     * Set the number of views to customize rendering of different visual elements of the tree
     * UI component. The following decorative elements can be customized:

    - **"close" ** - closed tree item icon view
    - **"open" **  - opened tree item icon view
    - **"leaf" **  - leaf tree item icon view
    - **"on" **    - toggle on view
    - **"off" **   - toggle off view
    - **"iselect" **   - a view to express an item selection when tree component doesn't hold focus
    - **"aselect" **   - a view to express an item selection when tree component holds focus

     * For instance:

        // build tree UI component
        var tree = new zebkit.ui.tree.Tree({
            value: "Root",
            kids: [
                "Item 1",
                "Item 2"
            ]
        });

        // set " [x] " text render for toggle on and
        // " [o] " text render for toggle off tree elements
        tree.setViews({
            "on": new zebkit.ui.TextRender(" [x] "),
            "off": new zebkit.ui.TextRender(" [o] ")
        });

     * @param {Object} v dictionary of tree component decorative elements views
     * @method setViews
     */
    function setViews(v) {
        // setting to 0 prevents exception when on/off view is not defined
        this.viewSizes.on  = { width: 0, height : 0};
        this.viewSizes.off = { width: 0, height : 0};
        for(var k in v) {
            if (v.hasOwnProperty(k)) {
                var vv = ui.$view(v[k]);

                this.views[k] = vv;
                if (k != "aselect" && k != "iselect"){
                    this.viewSizes[k] = vv ? vv.getPreferredSize() : { width: 0, height : 0};
                    this.vrp();
                }
            }
        }
        return this;
    },

    /**
     * Set the given tree model to be visualized with the UI component.
     * @param {zebkit.data.TreeModel|Object} d a tree model
     * @method setModel
     */
    function setModel(d){
        if (this.model != d) {
            if (zebkit.instanceOf(d, zebkit.data.TreeModel) === false) {
                d = new zebkit.data.TreeModel(d);
            }

            this.select(null);
            if (this.model != null && this.model._) this.model.bind(this);
            this.model = d;
            if (this.model != null && this.model._) this.model.bind(this);
            this.firstVisible = null;
            delete this.nodes;
            this.nodes = {};
            this.vrp();
        }
        return this;
    },

    function invalidate(){
        if (this.isValid === true){
            this._isVal = false;
        }
        this.$super();
    }
}
