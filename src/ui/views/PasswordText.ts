import TextRender from './TextRender';
import SingleLineText from '../../data/SingleLineText';

/**
 * Password text render class. This class renders a secret text with hiding it with the given character.
 * @param {String|zebkit.data.TextModel} [text] a text as string or text model instance
 * @class zebkit.ui.PasswordText
 * @constructor
 * @extends zebkit.ui.TextRender
 */
export default class PasswordText extends TextRender {
    echo: string;
    showLast: boolean;

    constructor(text){
        super(text);

        if (arguments.length === 0) {
            text = new SingleLineText("");
        }

        /**
         * Echo character that will replace characters of hidden text
         * @attribute echo
         * @type {String}
         * @readOnly
         * @default "*"
         */
        this.echo = "*";

        /**
         * Indicates if the last entered character doesn't have to be replaced with echo character
         * @type {Boolean}
         * @attribute showLast
         * @default true
         * @readOnly
         */
        this.showLast = true;        
    }

    /**
     * Set the specified echo character. The echo character is used to hide secret text.
     * @param {String} ch an echo character
     * @method setEchoChar
     */
    setEchoChar(ch){
        if (this.echo != ch){
            this.echo = ch;
            if (this.target != null) {
                this.invalidate(0, this.target.getLines());
            }
        }
        return this;
    }

    getLine(r){
        var buf = [], ln = super.getLine(r);
        for(var i = 0;i < ln.length; i++) buf[i] = this.echo;
        if (this.showLast && ln.length > 0) buf[ln.length-1] = ln[ln.length-1];
        return buf.join('');
    }
}