/**
 * Popup window manager class. The manager registering and triggers showing context popup menu
 * and tooltips. Menu appearing is triggered by right pointer click or double fingers touch event.
 * To bind a popup menu to an UI component you can either set "tooltip" property of the component
 * with a popup menu instance:

        // create canvas
        var canvas = new zebkit.ui.zCanvas();

        // create menu with three items
        var m = new zebkit.ui.Menu();
        m.add("Menu Item 1");
        m.add("Menu Item 2");
        m.add("Menu Item 3");

        // bind the menu to root panel
        canvas.root.popup = m;

 * Or implement "getPopup(target,x,y)" method that can rule showing popup menu depending on
 * the current cursor location:

        // create canvas
        var canvas = new zebkit.ui.zCanvas();

        // visualize 50x50 pixels hot component spot
        // to which the context menu is bound
        canvas.root.paint = function(g) {
            g.setColor("red");
            g.fillRect(50,50,50,50);
        }

        // create menu with three items
        var m = new zebkit.ui.Menu();
        m.add("Menu Item 1");
        m.add("Menu Item 2");
        m.add("Menu Item 3");

        // implement "getPopup" method that shows popup menu only
        // if pointer cursor located at red rectangular area of the
        // component
        canvas.root.getPopup = function(target, x, y) {
            // test if pointer cursor position is in red spot area
            // and return context menu if it is true
            if (x > 50 && y > 50 && x < 100 && y <  100)  {
                return m;
            }
            return null;
        }

 *  Defining a tooltip for an UI component follows the same approach. Other you
 *  define set "tooltip" property of your component with a component that has to
 *  be shown as the tooltip:

         // create canvas
         var canvas = new zebkit.ui.zCanvas();

         // create tooltip
         var t = new zebkit.ui.Label("Tooltip");
         t.setBorder("plain");
         t.setBackground("yellow");
         t.setPadding(6);

         // bind the tooltip to root panel
         canvas.root.popup = t;

*  Or you can implement "getTooltip(target,x,y)" method if the tooltip showing depends on
*  the pointer cursor location:


        // create canvas
        var canvas = new zebkit.ui.zCanvas();

        // create tooltip
        var t = new zebkit.ui.Label("Tooltip");
        t.setBorder("plain");
        t.setBackground("yellow");
        t.setPadding(6);

        // bind the tooltip to root panel
        canvas.root.getPopup = function(target, x, y) {
            return x < 10 && y < 10 ? t : null;
        };

 * @class zebkit.ui.PopupManager
 * @extends zebkit.ui.Manager
 * @constructor
 */

 /**
  * Fired when a menu item has been selected

         zebkit.ui.events.bind(function menuItemSelected(menu, index, item) {
             ...
         });

  *
  * @event menuItemSelected
  * @param {zebkit.ui.Menu} menu a menu component that triggers the event
  * @param {Integer}  index a menu item index that has been selected
  * @param {zebkit.ui.Panel} item a menu item component that has been selected
  */
import Manager from '../core/Manager';

export default class PopupManager extends Manager {
    hideTooltipByPress: boolean;
    syncTooltipPosition: boolean;

    showTooltipIn: number;

    $popupMenuX: number;
    $popupMenuY: number;
    $tooltipX: number;
    $tooltipY: number;

    $targetTooltipLayer: any;
    $tooltip: any;
    $target: any;

    $toolTask: any;

    constructor() {
        super();
        /**
         * Indicates if a shown tooltip has to disappear by pointer pressed event
         * @attribute hideTooltipByPress
         * @type {Boolean}
         * @default true
         */
        this.hideTooltipByPress = false;

        /**
         * Define interval (in milliseconds) between entering a component and showing
         * a tooltip for the entered component
         * @attribute showTooltipIn
         * @type {Integer}
         * @default 400
         */
        this.showTooltipIn = 400;

        this.syncTooltipPosition = true;


        this.$popupMenuX = this.$popupMenuY = 0;
        this.$tooltipX = this.$tooltipY = 0;
        this.$targetTooltipLayer = this.$tooltip = this.$target = null;
    }

    /**
     * Define pointer clicked event handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerClicked
     */
    pointerClicked(e){
        this.$popupMenuX = e.absX;
        this.$popupMenuY = e.absY;

        // Right button
        // TODO: check if it is ok and compatible with touch
        if (this.isTriggeredWith(e)) {
            var popup = null;

            if (e.source.popup != null) {
                popup = e.source.popup;
            } else {
                if (e.source.getPopup != null) {
                    popup = e.source.getPopup(e.source, e.x, e.y);
                }
            }

            if (popup != null) {
                popup.setLocation(this.$popupMenuX, this.$popupMenuY);
                e.source.getCanvas().getLayer(pkg.PopupLayer.ID).add(popup);
                popup.requestFocus();
            }
        }
    }

    isTriggeredWith(e) {
        return e.isAction() === false && (e.identifier === "rmouse" || e.touchCounter === 2);
    }

    /**
     * Define pointer entered event handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerEntered
     */
    pointerEntered(e) {
        if (this.$target == null && (e.source.tooltip != null || e.source.getTooltip != null)) {
            var c = e.source;
            this.$target = c;
            this.$targetTooltipLayer = c.getCanvas().getLayer(pkg.WinLayer.ID);
            this.$tooltipX = e.x;
            this.$tooltipY = e.y;
            this.$toolTask = zebkit.util.task(this).run(this.showTooltipIn, this.showTooltipIn);
        }
    }

    /**
     * Define pointer exited event handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerExited
     */
    pointerExited(e) {
        // exited triggers tooltip hiding only for "info" tooltips
        if (this.$target != null && (this.$tooltip == null || this.$tooltip.winType === "info")) {
            this.stopShowingTooltip();
        }
    }

    /**
     * Define pointer moved event handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerMoved
     */
    pointerMoved(e) {
        // to prevent handling pointer moved from component of mdi
        // tooltip we have to check if target equals to source
        // instead of just checking if target is not a null
        if (this.$target === e.source) {
            // store a new location for a tooltip
            this.$tooltipX = e.x;
            this.$tooltipY = e.y;

            // wake up task try showing a tooltip
            // at the new location
            if (this.$toolTask != null) {
                this.$toolTask.run(this.showTooltipIn);
            }
        }
    }

    /**
     * Task body method
     * @private
     * @param  {Task} t a task context
     * @method run
     */
    run(t) {
        if (this.$target != null) {
            var ntooltip = this.$target.tooltip != null ? this.$target.tooltip
                                                        : this.$target.getTooltip(this.$target,
                                                                                  this.$tooltipX,
                                                                                  this.$tooltipY);
            if (this.$tooltip != ntooltip) {
                // hide previously shown tooltip
                if (this.$tooltip != null) {
                    this.hideTooltip();
                }

                // set new tooltip
                this.$tooltip = ntooltip;

                // if new tooltip exists than show it
                if (ntooltip != null) {
                    var p = zebkit.layout.toParentOrigin(this.$tooltipX, this.$tooltipY, this.$target);

                    this.$tooltip.toPreferredSize();
                    var tx = p.x,
                        ty = p.y - this.$tooltip.height,
                        dw = this.$targetTooltipLayer.width;

                    if (tx + this.$tooltip.width > dw) {
                        tx = dw - this.$tooltip.width - 1;
                    }

                    this.$tooltip.setLocation(tx < 0 ? 0 : tx, ty < 0 ? 0 : ty);

                    if (this.$tooltip.winType == null) {
                        this.$tooltip.winType = "info";
                    }

                    this.$targetTooltipLayer.addWin(this.$tooltip, this);

                    if (this.$tooltip.winType !== "info") {
                        pkg.activateWindow(this.$tooltip);
                    }
                }
            } else {
                if (this.$tooltip != null && this.syncTooltipPosition === true) {
                    var p  = zebkit.layout.toParentOrigin(this.$tooltipX, this.$tooltipY, this.$target),
                        tx = p.x,
                        ty = p.y - this.$tooltip.height;

                    this.$tooltip.setLocation(tx < 0 ? 0 : tx, ty < 0 ? 0 : ty);
                }
            }
        }
        t.pause();
    }

    winActivated(e) {
        // this method is called for only for mdi window
        // consider every deactivation of a mdi window as
        // a signal to stop showing tooltip
        if (e.isActive === false && this.$tooltip != null)  {
            this.$tooltip.removeMe();
        }
    }

    winOpened(e) {
        if (e.isShown === false) {
            // cleanup tooltip reference
            this.$tooltip = null;

            if (e.source.winType !== "info") {
                this.stopShowingTooltip();
            }
        }
    }

    stopShowingTooltip () {
        if (this.$target != null) {
            this.$target = null;
        }

        if (this.$toolTask != null) {
            this.$toolTask.shutdown();
        }

        this.hideTooltip();
    }

    /**
     * Hide tooltip if it has been shown
     * @method hideTooltip
     */
    hideTooltip(){
        if (this.$tooltip != null) {
            this.$tooltip.removeMe();
            this.$tooltip = null;
        }
    }

    /**
     * Define pointer pressed event handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerPressed
     */
    pointerPressed(e){
        if (this.hideTooltipByPress === true &&
            e.pointerType === "mouse" &&
            this.$target != null &&
            (this.$tooltip == null || this.$tooltip.winType === "info"))
        {
            this.stopShowingTooltip();
        }
    }

    /**
     * Define pointer released event handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerReleased
     */
    pointerReleased(e) {
        if ((this.hideTooltipByPress === false || e.pointerType !== "mouse") &&
            this.$target != null &&
            (this.$tooltip == null || this.$tooltip.winType === "info"))
        {
            this.stopShowingTooltip();
        }
    }
}