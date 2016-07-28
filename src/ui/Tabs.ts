/**
 * Tabs UI panel. The component is used to organize switching
 * between number of pages where every page is an UI component.
 *
 *  Filling tabs component with pages is the same to how you add
 *  an UI component to a panel. For instance in the example below
 *  three pages with "Titl1", "Title2", "Title3" are added:

      var tabs = new zebkit.ui.Tabs();
      tabs.add("Title1", new zebkit.ui.Label("Label as a page"));
      tabs.add("Title2", new zebkit.ui.Button("Button as a page"));
      tabs.add("Title3", new zebkit.ui.TextArea("Text area as a page"));

 *  You can access tabs pages UI component the same way like you
 *  access a panel children components

     ...
     tabs.kids[0] // access the first page

 *  And you can remove it with standard panel inherited API:

     ...
     tabs.removeAt(0); // remove first tab page


 *  To customize tab page caption and icon you should access tab object and
 *  do it with API it provides:


        // update a tab caption
        tabs.getTab(0).setCaption("Test");

        // update a tab icon
        tabs.getTab(0).setIcon("my.gif");

        // set a particular font and color for the tab in selected state
        tabs.getTab(0).setColor(true, "blue");
        tabs.getTab(0).setFont(true, new zebkit.ui.Font("Arial", "bold", 16));

        // set other caption for the tab in not selected state
        tabs.getTab(0).setCaption(false, "Test");

 * @param {String} [o] the tab panel orientation:

      "top"
      "bottom"
      "left"
      "right"

 * @class zebkit.ui.Tabs
 * @constructor
 * @extends {zebkit.ui.Panel}
 */

/**
 * Fired when a new tab page has been selected

      tabs.bind(function (src, selectedIndex) {
         ...
      });

 * @event selected
 * @param {zebkit.ui.Tabs} src a tabs component that triggers the event
 * @param {Integer} selectedIndex a tab page index that has been selected
 */

import Panel from './core/Panel';
import TabView from './TabView';
import { intersect } from '../utils';
import KeyEvent from './web/keys/KeyEvent'

export default class Tabs extends Panel, $ViewsSetterMix {
    get clazz() {
        return {
            TabView: TabView
        }      
    }

    canHaveFocus: boolean;
    vgap: number;
    hgap: number;
   
    repaintWidth: number;
    repaintHeight: number;
   
    repaintX: number; 
    repaintY: number;

    tabAreaX: number;
    tabAreaY: number;

    sideSpace: number;

    tabAreaWidth: number;
    tabAreaHeight: number;

    overTab: number;
    selectedIndex: number;

    pages: any[];
    views: any;

    orient: string;

    /**
     * @for zebkit.ui.Tabs
     */
    constructor(o?) {
        super();

        /**
         * Declare can have focus attribute to make the component focusable
         * @type {Boolean}
         * @attribute canHaveFocus
         * @readOnly
         */
        this.canHaveFocus = true;

        if (arguments.length === 0) {
            o = "top";
        }

        /**
         * Selected tab page index
         * @attribute selectedIndex
         * @type {Integer}
         * @readOnly
         */


        /**
         * Tab orientation
         * @attribute orient
         * @type {String}
         * @readOnly
         */

        /**
         * Sides gap
         * @attribute sideSpace
         * @type {Integer}
         * @readOnly
         * @default 1
         */

        this.vgap = this.hgap = this.tabAreaX = 0;
        this.repaintWidth = this.repaintHeight = this.repaintX = this.repaintY = 0;
        this.sideSpace = 1;

        this.tabAreaY = this.tabAreaWidth = this.tabAreaHeight = 0;
        this.overTab = this.selectedIndex = -1;
        this.orient = o;
        this._ = new zebkit.util.Listeners();
        this.pages = [];
        this.views = {};

        if (Tabs.font != null) this.render.setFont(pkg.Tabs.font);
        if (Tabs.fontColor != null) this.render.setColor(pkg.Tabs.fontColor);

        // since alignment pass as the constructor argument the setter has to be called after $super
        // because $super can re-set title alignment
        this.setAlignment(o);        
    }

    /**
     * Define pointer moved event handler
     * @param  {zebkit.ui.PointerEvent} e a key event
     * @method pointerMoved
     */
    pointerMoved(e) {
        var i = this.getTabAt(e.x, e.y);
        if (this.overTab != i) {
            this.overTab = i;
            if (this.views.tabover != null) {
                this.repaint(this.repaintX, this.repaintY,
                              this.repaintWidth, this.repaintHeight);
            }
        }
    }

    /**
     * Define pointer drag ended event handler
     * @param  {zebkit.ui.PointerEvent} e a key event
     * @method pointerDragEnded
     */
    pointerDragEnded(e) {
        var i = this.getTabAt(e.x, e.y);
        if (this.overTab != i) {
            this.overTab = i;
            if (this.views.tabover != null) {
                this.repaint(this.repaintX, this.repaintY,
                              this.repaintWidth, this.repaintHeight);
            }
        }
    }

    /**
     * Define pointer exited event handler
     * @param  {zebkit.ui.PointerEvent} e a key event
     * @method pointerExited
     */
    pointerExited(e) {
        if (this.overTab >= 0) {
            this.overTab = -1;
            if (this.views.tabover != null) {
                this.repaint(this.repaintX, this.repaintY,
                              this.repaintWidth, this.repaintHeight);
            }
        }
    }

    /**
     * Navigate to a next tab page following the given direction starting
     * from the given page
     * @param  {Integer} page a starting page index
     * @param  {Integer} d a navigation direction. 1 means forward and -1 means backward
     * navigation.
     * @return {Integer}      a new tab page index
     * @method next
     */
    next(page, d){
        for(; page >= 0 && page < Math.floor(this.pages.length / 2); page += d) {
            if (this.isTabEnabled(page) === true) return page;
        }
        return -1;
    }

    getTitleInfo(){
        var b   = (this.orient === "left" || this.orient === "right"),
            res = b ? { x      : this.tabAreaX,
                        y      : 0,
                        width  : this.tabAreaWidth,
                        height : 0,
                        orient : this.orient }
                    : { x      : 0,
                        y      : this.tabAreaY,
                        width  : 0,
                        height : this.tabAreaHeight,
                        orient : this.orient };

        if (this.selectedIndex >= 0){
            var r = this.getTabBounds(this.selectedIndex);
            if (b){
                res.y = r.y;
                res.height = r.height;
            }
            else{
                res.x = r.x;
                res.width = r.width;
            }
        }
        return res;
    }

    /**
     * Test if the given tab page is in enabled state
     * @param  {Integer} index a tab page index
     * @return {Boolean} a tab page state
     * @method isTabEnabled
     */
    isTabEnabled(index) {
        return this.kids[index].isEnabled;
    }

    paintOnTop(g) {
        var ts = g.$states[g.$curState];
        // stop painting if the tab area is outside of clip area
        if (intersect.isIntersect(this.repaintX, this.repaintY,
                                    this.repaintWidth, this.repaintHeight,
                                    ts.x, ts.y, ts.width, ts.height))
        {
            if (this.selectedIndex > 0){
                var r = this.getTabBounds(this.selectedIndex);
            }

            for(var i = 0;i < this.selectedIndex; i++) {
                this.paintTab(g, i);
            }

            for(var i = this.selectedIndex + 1;i < Math.floor(this.pages.length / 2); i++) {
                this.paintTab(g, i);
            }

            if (this.selectedIndex >= 0){
                this.paintTab(g, this.selectedIndex);
                if (this.hasFocus()) {
                    this.drawMarker(g, this.getTabBounds(this.selectedIndex));
                }
            }
        }
    }

    /**
     * Draw currently activate tab page marker.
     * @param  {2DContext} g a graphical context
     * @param  {Object} r a tab page title rectangular area
     * @method drawMarker
     */
    drawMarker(g,r){
        var marker = this.views.marker;
        if (marker != null){
            //TODO: why only "tab" is checked ?
            var bv = this.views.tab,
                left = bv == null ? 0 : bv.getLeft(),
                top  = bv == null ? 0 : bv.getTop();
            marker.paint(g, r.x + left, r.y + top,
                            r.width  - left - (bv == null ? 0 : bv.getRight()),
                            r.height - top  - (bv == null ? 0 : bv.getBottom()), this);
        }
    }

    /**
     * Paint the given tab page title
     * @param  {2DContext} g a graphical context
     * @param  {Integer} pageIndex a tab page index
     * @method paintTab
     */
    paintTab(g, pageIndex){
        var b       = this.getTabBounds(pageIndex),
            page    = this.kids[pageIndex],
            tab     = this.views.tab,
            tabover = this.views.tabover,
            tabon   = this.views.tabon,
            v       = this.pages[pageIndex * 2],
            ps      = v.getPreferredSize();

        if (this.selectedIndex === pageIndex && tabon != null) {
            tabon.paint(g, b.x, b.y, b.width, b.height, page);
        }
        else {
            if (tab != null) {
                tab.paint(g, b.x, b.y, b.width, b.height, page);
            }
        }

        if (this.overTab >= 0 && this.overTab === pageIndex && tabover != null) {
            tabover.paint(g, b.x, b.y, b.width, b.height, page);
        }

        v.paint(g, b.x + Math.floor((b.width - ps.width) / 2),
                    b.y + Math.floor((b.height - ps.height) / 2),
                    ps.width, ps.height, page);
    }

    /**
     * Get the given tab page title rectangular bounds
     * @param  {Integer} i a tab page index
     * @return {Object} a tab page rectangular bounds
     *
     *    {x:{Integer}, y:{Integer}, width:{Integer}, height:{Integer}}
     *
     * @protected
     * @method getTabBounds
     */
    getTabBounds = function(i) {
        return this.pages[2 * i + 1];
    }

    calcPreferredSize(target){
        var max = zebkit.layout.getMaxPreferredSize(target);
        if (this.orient === "bottom" || this.orient === "top"){
            max.width = Math.max(max.width, 2 * this.sideSpace + this.tabAreaWidth);
            max.height += this.tabAreaHeight + this.sideSpace;
        }
        else {
            max.width += this.tabAreaWidth + this.sideSpace;
            max.height = Math.max(max.height, 2 * this.sideSpace + this.tabAreaHeight);
        }
        return max;
    }

    doLayout(target){
        var right  = this.orient === "right"  ? this.right  : this.getRight(),
            top    = this.orient === "top"    ? this.top    : this.getTop(),
            bottom = this.orient === "bottom" ? this.bottom : this.getBottom(),
            left   = this.orient === "left"   ? this.left   : this.getLeft(),
            b      = (this.orient === "top" || this.orient === "bottom");

        if (b) {
            this.repaintX = this.tabAreaX = left ;
            this.repaintY = this.tabAreaY = (this.orient === "top") ? top : this.height - bottom - this.tabAreaHeight;
            if (this.orient === "bottom") {
                this.repaintY -= (this.border != null ? this.border.getBottom() : 0);
            }
        }
        else {
            this.repaintX = this.tabAreaX = (this.orient === "left" ? left : this.width - right - this.tabAreaWidth);
            this.repaintY = this.tabAreaY = top ;
            if (this.orient === "right") {
                this.repaintX -= (this.border != null ? this.border.getRight() : 0);
            }
        }

        var count = this.kids.length,
            sp    = 2 * this.sideSpace,
            xx    = (this.orient === "right"  ? this.tabAreaX : this.tabAreaX + this.sideSpace),
            yy    = (this.orient === "bottom" ? this.tabAreaY : this.tabAreaY + this.sideSpace);

        for(var i = 0; i < count; i++ ){
            var r = this.getTabBounds(i);

            r.x = xx;
            r.y = yy;

            if (b) {
                xx += r.width;
                if (i === this.selectedIndex) {
                    xx -= sp;
                    if (this.orient === "bottom") {
                        r.y -= (this.border != null ? this.border.getBottom() : 0);
                    }
                }
            }
            else {
                yy += r.height;
                if (i === this.selectedIndex) {
                    yy -= sp;
                    if (this.orient === "right") {
                        r.x -= (this.border != null ? this.border.getRight() : 0);
                    }
                }
            }
        }

        // make visible tab title
        if (this.selectedIndex >= 0){
            var r = this.getTabBounds(this.selectedIndex), dt = 0;
            if (b) {
                r.x -= this.sideSpace;
                r.y -= ((this.orient === "top") ? this.sideSpace : 0);
                dt = (r.x < left) ? left - r.x
                                  : (r.x + r.width > this.width - right) ? this.width - right - r.x - r.width : 0;
            }
            else {
                r.x -= (this.orient === "left") ? this.sideSpace : 0;
                r.y -= this.sideSpace;
                dt = (r.y < top) ? top - r.y
                                  : (r.y + r.height > this.height - bottom) ? this.height - bottom - r.y - r.height : 0;
            }

            for(var i = 0;i < count; i ++ ){
                var br = this.getTabBounds(i);
                if (b) br.x += dt;
                else   br.y += dt;
            }
        }

        for(var i = 0;i < count; i++){
            var l = this.kids[i];
            if (i === this.selectedIndex) {
                if (b) {
                    l.setBounds(left + this.hgap,
                                ((this.orient === "top") ? top + this.repaintHeight : top) + this.vgap,
                                this.width - left - right - 2 * this.hgap,
                                this.height - this.repaintHeight - top - bottom - 2 * this.vgap);
                }
                else {
                    l.setBounds(((this.orient === "left") ? left + this.repaintWidth : left) + this.hgap,
                                top + this.vgap,
                                this.width - this.repaintWidth - left - right - 2 * this.hgap,
                                this.height - top - bottom - 2 * this.vgap);
                }
            }
            else {
                l.setSize(0, 0);
            }
        }
    }

    /**
     * Define recalc method to compute the component metrical characteristics
     * @method recalc
     */
    recalc() {
        var count = Math.floor(this.pages.length / 2);
        if (count > 0) {
            this.tabAreaHeight = this.tabAreaWidth = 0;

            var bv   = this.views.tab,
                b    = (this.orient === "left" || this.orient === "right"),
                max  = 0,
                hadd = bv == null ? 0 : bv.getLeft() + bv.getRight(),
                vadd = bv == null ? 0 : bv.getTop()  + bv.getBottom();

            for(var i = 0;i < count; i++){
                var ps =  this.pages[i * 2] != null ? this.pages[i * 2].getPreferredSize()
                                                    : { width:0, height:0},
                    r = this.getTabBounds(i);

                if (b) {
                    r.height = ps.height + vadd;
                    if (ps.width + hadd > max) max = ps.width + hadd;
                    this.tabAreaHeight += r.height;
                }
                else {
                    r.width = ps.width + hadd;
                    if (ps.height + vadd > max) max = ps.height + vadd;
                    this.tabAreaWidth += r.width;
                }
            }

            // align tabs widths or heights to have the same size
            for(var i = 0; i < count; i++ ){
                var r = this.getTabBounds(i);
                if (b) r.width  = max;
                else   r.height = max;
            }

            if (b) {
                this.tabAreaWidth   = max + this.sideSpace;
                this.tabAreaHeight += (2 * this.sideSpace);
                this.repaintHeight  = this.tabAreaHeight;
                this.repaintWidth   = this.tabAreaWidth + (this.border != null ? (b === "left" ? this.border.getLeft()
                                                                                                : this.border.getRight())
                                                                                : 0);
            }
            else {
                this.tabAreaWidth += (2 * this.sideSpace);
                this.tabAreaHeight = this.sideSpace + max;
                this.repaintWidth  = this.tabAreaWidth;
                this.repaintHeight = this.tabAreaHeight + (this.border != null ? (b === "top" ? this.border.getTop()
                                                                                              : this.border.getBottom())
                                                                                : 0);
            }

            // make selected tab page title bigger
            if (this.selectedIndex >= 0) {
                var r = this.getTabBounds(this.selectedIndex);
                if (b) {
                    r.height += 2 * this.sideSpace;
                    r.width += this.sideSpace +  (this.border != null ? (b === "left" ? this.border.getLeft()
                                                                                      : this.border.getRight())
                                                                      : 0);
                }
                else {
                    r.height += this.sideSpace + (this.border != null ? (b === "top" ? this.border.getTop()
                                                                                      : this.border.getBottom())
                                                                      : 0);
                    r.width  += 2 * this.sideSpace;
                }
            }
        }
    }

    /**
     * Get tab index located at the given location
     * @param  {Integer} x a x coordinate
     * @param  {Integer} y a y coordinate
     * @return {Integer} an index of the tab that is
     * detected at the given location. -1 if no any
     * tab can be found
     * @method getTabAt
     */
    getTabAt(x,y){
        this.validate();
        if (x >= this.tabAreaX && y >= this.tabAreaY &&
            x < this.tabAreaX + this.tabAreaWidth &&
            y < this.tabAreaY + this.tabAreaHeight)
        {
            // handle selected as a special case since it can overlap neighborhood titles
            if (this.selectedIndex >= 0) {
                var tb = this.getTabBounds(this.selectedIndex);
                if (x >= tb.x && y >= tb.y && x < tb.x + tb.width && y < tb.y + tb.height) {
                    return i;
                }
            }

            for(var i = 0; i < Math.floor(this.pages.length / 2); i++) {
                if (this.selectedIndex != i) {
                    var tb = this.getTabBounds(i);
                    if (x >= tb.x && y >= tb.y && x < tb.x + tb.width && y < tb.y + tb.height) {
                        return i;
                    }
                }
            }
        }
        return -1;
    };

    /**
     * Define key pressed event handler
     * @param  {zebkit.ui.KeyEvent} e a key event
     * @method keyPressed
     */
    keyPressed(e){
        if (this.selectedIndex != -1 && this.pages.length > 0){
            switch(e.code) {
                case KeyEvent.UP:
                case KeyEvent.LEFT:
                    var nxt = this.next(this.selectedIndex - 1,  -1);
                    if(nxt >= 0) this.select(nxt);
                    break;
                case KeyEvent.DOWN:
                case KeyEvent.RIGHT:
                    var nxt = this.next(this.selectedIndex + 1, 1);
                    if(nxt >= 0) this.select(nxt);
                    break;
            }
        }
    }

    /**
     * Define pointer clicked  event handler
     * @param  {zebkit.ui.PointerEvent} e a key event
     * @method pointerClicked
     */
    pointerClicked(e){
        if (e.isAction()){
            var index = this.getTabAt(e.x, e.y);
            if (index >= 0 && this.isTabEnabled(index)) this.select(index);
        }
    }

    /**
     * Switch to the given tab page
     * @param  {Integer} index a tab page index to be navigated
     * @method select
     */
    select(index){
        if (this.selectedIndex != index){
            var prev = this.selectedIndex;
            this.selectedIndex = index;

            if (prev >= 0) {
                this.pages[prev * 2].selected(this, prev, false);
            }

            if (index >= 0) {
                this.pages[index * 2].selected(this, index, true);
            }

            this._.fired(this, this.selectedIndex);
            this.vrp();
        }
    }

    /**
     * Get the given tab. Using the tab you can control tab caption,
     * icon.
     * @param {Integer} pageIndex a tab page index
     * @return  {zebkit.ui.Tabs.TabView}
     * @method getTab
     */
    getTab(pageIndex){
        return this.pages[pageIndex * 2];
    }

    /**
     * Set tab side spaces.
     * @param {Integer} sideSpace  [description]
     * @method setSideSpace
     */
    setSideSpace(sideSpace){
        if (sideSpace != this.sideSpace) {
            this.sideSpace = sideSpace;
            this.vrp();
        }
        return this;
    }

    setPageGaps(vg,hg){
        if (this.vgap != vg || hg != this.hgap){
            this.vgap = vg;
            this.hgap = hg;
            this.vrp();
        }
        return this;
    }

    /**
     * Set the tab page element alignments
     * @param {String} o an alignment. The valid value is one of the following:
     * "left", "right", "top", "bottom"
     * @method  setAlignment
     */
    setAlignment(o){
        if (this.orient !== o) {
            this.orient = zebkit.util.$validateValue(o, "top", "bottom", "left", "right");
            this.vrp();
        }
        return this;
    }

    /**
     * Set enabled state for the given tab page
     * @param  {Integer} i a tab page index
     * @param  {Boolean} b a tab page enabled state
     * @method enableTab
     */
    enableTab(i,b){
        var c = this.kids[i];
        if (c.isEnabled != b){
            c.setEnabled(b);
            if (b === false && this.selectedIndex === i) {
                this.select(-1);
            }
            this.repaint();
        }
        return this;
    }

    /**
     *  Set number of views to render different Tab component elements
     *  @param {Object} a set of views as dictionary where key is a view
     *  name and the value is a view instance, string(for color), or render
     *  function. The following view elements can be passed:
     *
     *
     *      {
     *         "tab"    : <view to render not selected tab page>,
     *         "tabover": <view to render a tab page when pointer is over>
     *         "tabon"  : <a view to render selected tab page>
     *         "marker" : <a marker view to be rendered around tab page title>
     *      }
     *
     *
     *  @method  setViews
     */

    // static

    focused(){
        super.focused();
        if (this.selectedIndex >= 0){
            var r = this.getTabBounds(this.selectedIndex);
            this.repaint(r.x, r.y, r.width, r.height);
        }
        else {
            if (this.hasFocus() === false) {
                this.select(this.next(0, 1));
            }
        }
    }

    kidAdded(index,constr,c) {
        // correct wrong selection if inserted tab index is less or equals
        if (this.selectedIndex >= 0 && index <= this.selectedIndex) {
            this.selectedIndex++;
        }

        if (this.selectedIndex < 0) {
            this.select(this.next(0, 1));
        }

        return super.kidAdded(index,constr,c);
    }

    insert(index,constr?,c?) {
        var render = null;
        if (types.instanceOf(constr, this.clazz.TabView)) {
            render = constr;
        }
        else {
            let icon = (constr == null ? "Page " + index : constr )
            render = new this.clazz.TabView(icon);
            render.ownerChanged(this); // TODO: a little bit ugly but setting an owner is required to
                                       // keep tabs component informed when an icon has been updated
        }

        this.pages.splice(index * 2, 0, render, { x:0, y:0, width:0, height:0 });
        return super.insert(index, constr, c);
    }

    removeAt(i){
        if (this.selectedIndex >= 0 && i <= this.selectedIndex) {
            if (i === this.selectedIndex) this.select(-1);
            else {
                this.selectedIndex--;
                this.repaint();
            }
        }
        this.pages.splice(i * 2, 2);
        super.removeAt(i);
    }

    removeAll(){
        this.select(-1);
        this.pages.splice(0, this.pages.length);
        this.pages.length = 0;
        super.removeAll();
    }

    setSize(w,h){
        if (this.width != w || this.height != h){
            if (this.orient === "right" || this.orient === "bottom") {
                this.tabAreaX =  -1;
            }
            super.setSize(w, h);
        }
        return this;
    }
}
