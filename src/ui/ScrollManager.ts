/**
 * Scroll manager class.
 * @param {zebkit.ui.Panel} t a target component to be scrolled
 * @constructor
 * @class zebkit.ui.ScrollManager
 */

 /**
  * Fired when a target component has been scrolled

        scrollManager.bind(function(px, py) {
            ...
        });

  * @event scrolled
  * @param  {Integer} px a previous x location target component scroll location
  * @param  {Integer} py a previous y location target component scroll location
  */

 /**
  * Fired when a scroll state has been updated

        scrollManager.scrollStateUpdated = function(x, y, px, py) {
            ...
        };

  * @event scrollStateUpdated
  * @param  {Integer} x a new x location target component scroll location
  * @param  {Integer} y a new y location target component scroll location
  * @param  {Integer} px a previous x location target component scroll location
  * @param  {Integer} py a previous y location target component scroll location
  */
import { ListenersClass } from '../utils/listen'; 

export default class ScrollManager {
    get clazz() {
        return {
            Listeners: ListenersClass("scrolled")
        };        
    }

    target: any;
    sx: number;
    sy: number;

    constructor(target) {
        this.sx = this.sy = 0;
        this._  = new this.clazz.Listeners();

        /**
         * Target UI component for that the scroll manager has been instantiated
         * @attribute target
         * @type {zebkit.ui.Panel}
         * @readOnly
         */
        this.target = target;
    }
    /**
     * Get current target component x scroll location
     * @return {Integer} a x scroll location
     * @method getSX
     */
    getSX() {
        return this.sx;
    }

    /**
     * Get current target component y scroll location
     * @return {Integer} a y scroll location
     * @method getSY
     */
    getSY() {
        return this.sy;
    }

    /**
     * Set a target component scroll x location to the
     * specified value
     * @param  {Integer} v a x scroll location
     * @method scrollXTo
     */
    scrollXTo(v){
        this.scrollTo(v, this.getSY());
    }

    /**
     * Set a target component scroll y location to the
     * specified value
     * @param  {Integer} v a y scroll location
     * @method scrollYTo
     */
    scrollYTo(v){
        this.scrollTo(this.getSX(), v);
    }

    /**
     * Scroll the target component into the specified location
     * @param  {Integer} x a x location
     * @param  {Integer} y a y location
     * @method scrollTo
     */
    scrollTo(x, y){
        var psx = this.getSX(),
            psy = this.getSY();

        if (psx != x || psy != y){
            this.sx = x;
            this.sy = y;
            if (this.scrollStateUpdated != null) this.scrollStateUpdated(x, y, psx, psy);
            if (this.target.catchScrolled != null) this.target.catchScrolled(psx, psy);
            this._.scrolled(psx, psy);
        }
        return this;
    }

    /**
     * Make visible the given rectangular area of the
     * scrolled target component
     * @param  {Integer} x a x coordinate of top left corner
     * of the rectangular area
     * @param  {Integer} y a y coordinate of top left corner
     * of the rectangular area
     * @param  {Integer} w a width of the rectangular area
     * @param  {Integer} h a height of the rectangular area
     * @method makeVisible
     */
    makeVisible(x,y,w,h){
        var p = pkg.calcOrigin(x, y, w, h, this.getSX(), this.getSY(), this.target);
        this.scrollTo(p[0], p[1]);
        return this;
    }
}