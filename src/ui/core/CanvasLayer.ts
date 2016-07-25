
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
import HtmlCanvas from './HtmlCanvas';

export default class CanvasLayer extends HtmlCanvas {
    id: string;

    constructor(e) {
        super(e);

        this.id = this.clazz.ID;
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
    }
}