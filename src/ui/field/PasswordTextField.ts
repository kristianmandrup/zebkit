import TextField from './TextField';

/**
 * Password text field.
 * @class zebkit.ui.PassTextField
 * @param {String} txt password text
 * @param {Integer} [maxSize] maximal size
 * @param {Boolean} [showLast] indicates if last typed character should
 * not be disguised with a star character
 * @extends zebkit.ui.TextField
 */
class PasswordTextField extends TextField {
    function(txt, size, showLast) {
        if (arguments.length === 1) {
            showLast = false;
            size     = -1;

            if (zebkit.isBoolean(txt)) {
                showLast = txt;
                txt      = "";
            } else if (zebkit.isNumber(txt)) {
                size = txt;
                txt = "";
            }
        } else if (arguments.length === 0) {
            showLast = false;
            size     = -1;
            txt      = "";
        } else if (arguments.length === 2) {
            showLast = false;
        }

        var pt = new pkg.PasswordText(new zebkit.data.SingleLineTxt(txt, size));
        pt.showLast = showLast;
        this.$super(pt);
        if (size > 0) {
            this.setPSByRowsCols(-1, size);
        }
    },

    function setShowLast(b) {
        if (this.showLast !== b) {
            this.view.showLast = b;
            this.repaint();
        }
        return this;
    }
}