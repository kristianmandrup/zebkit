var MENU_EVENT = new MenuEvent();
var WIN_EVENT  = new WinEvent();

export { default as HtmlWinCanvas } from './HtmlWinCanvas';
export { default as MenuEvent } from './MenuEvent';

/**
 * Show the given UI component as a modal window
 * @param  {zebkit.ui.Panel} context  an UI component of zebkit hierarchy
 * @param  {zebkit.ui.Panel} win a component to be shown as the modal window
 * @param  {Object} [listener] a window listener

        {
            winActivated : function(e) {

            },

            winOpened : function(e) {

            }
        }

 * @api  zebkit.ui.showModalWindow()
 * @method showWindow
 */

import layout from '../..';

export const showModalWindow = function(context, win, listener) {
    showWindow(context, "modal", win, listener);
};

/**
 * Show the given UI component as a window
 * @param  {zebkit.ui.Panel} context  an UI component of zebkit hierarchy
 * @param  {String} [type] a type of the window: "modal", "mdi", "info". The default
 * value is "info"
 * @param  {zebkit.ui.Panel} win a component to be shown as the window
 * @param  {Object} [listener] a window listener

        {
            winActivated : function(e) {
               ...
            },

            winOpened : function(e) {
              ...
            }
        }

 * @api  zebkit.ui.showWindow()
 * @method showWindow
 */
export const showWindow = function(context, type, win, listener) {
    if (arguments.length < 3) {
        win  = type;
        type = "info";
    }
    return context.getCanvas().getLayer("win").addWin(type, win, listener);
};

export const showPopupMenu = function(context, menu) {
    context.getCanvas().getLayer("pop").add(menu);
};

/**
 * Activate the given window or a window the specified component belongs
 * @param  {zebkit.ui.Panel} win an UI component to be activated
 * @api zebkit.ui.activateWindow()
 * @method activateWindow
 */
export const activateWindow = function(win) {
    var l = win.getCanvas().getLayer("win");
    l.activate(layout.getDirectChild(l, win));
};
