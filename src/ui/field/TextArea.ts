import TextField from './TextField';

/**
 * Text area UI component. The UI component to render multi-lines text.
 * @class zebkit.ui.TextArea
 * @constructor
 * @param {String} [txt] a text
 * @extends zebkit.ui.TextField
 */
import Text from '../../data/Text';

export default class TextArea extends TextField {
    constructor(txt: string = '') {
        super(new Text(txt));        
    }
}
