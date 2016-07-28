import Render from './Render';
import { fonts } from './utils/fonts'; // FIX
import Font from '../web/Font';
import { types } from '../../utils';

export default class BaseTextRender extends Render {
    $clazz = {
        font: fonts.font,
        color: 'gray',
        disabledColor: 'white'
    }

    owner: any;
    lineIndent: number;
    color: string;
    font: any; // FIX

    constructor(clazz) {
        super(clazz);
        /**
         * UI component that holds the text render
         * @attribute owner
         * @default null
         * @readOnly
         * @protected
         * @type {zebkit.ui.Panel}
         */
        this.owner = null;

        this.lineIndent = 1;
    }

    // implement position metric methods
    getMaxOffset() {
        return 0;
    } 

    getLineSize() {
        return 0;
    } 

    getLines() {
        return 0;
    }


    /**
     * Set the rendered text font.
     * @param  {String|zebkit.ui.Font} f a font as CSS string or
     * zebkit.ui.Font class instance
    *  @chainable
        * @method setFont
        */
    setFont(f) {
        var old = this.font;

        if (types.instanceOf(f, Font) === false && f != null) {
            f = types.newInstance(Font, arguments);
        }

        if (f != old) {
            this.font = f;

            if (this.owner != null && this.owner.isValid === true) {
                this.owner.invalidate();
            }

            if (this.invalidate != null) {
                this.invalidate();
            }
        }
        return this;
    }

    resizeFont(size) {
        return this.setFont(this.font.resize(size));
    };

    restyleFont(style) {
        return this.setFont(this.font.restyle(style));
    };

    getLineHeight() {
        return this.font.height;
    };

    /**
     * Set rendered text color
     * @param  {String} c a text color
     * @method setColor
     * @chainable
     */
    setColor(c){
        if (c != this.color) {
            this.color = c.toString();
        }
        return this;
    }

    /**
     * Called whenever an owner UI component has been changed
     * @param  {zebkit.ui.Panel} v a new owner UI component
     * @method ownerChanged
     */
    ownerChanged(v) {
        this.owner = v;
    }

    targetWasChanged = (o, n) => {
        if (this.owner != null && this.owner.isValid) {
            this.owner.invalidate();
        }

        if (this.invalidate != null) {
            this.invalidate();
        }
    }
}