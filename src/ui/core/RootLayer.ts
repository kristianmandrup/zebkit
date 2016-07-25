/**
 *  Root layer implementation. This is the simplest UI layer implementation
 *  where the layer always try grabbing all input event
 *  @class zebkit.ui.RootLayer
 *  @constructor
 *  @extends {zebkit.ui.CanvasLayer}
 */
import CanvasLayer from './CanvasLayer';
import * as layout from '../../layout'

export default class RootLayer extends CanvasLayer {    
    static ID = 'root';
    static layout = new layout.RasterLayout();

    constructor(e) {
        super(e);
    }

    getFocusRoot() {
        return this;
    }
}
