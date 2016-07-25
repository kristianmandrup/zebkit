var $keyPressedCode = -1, KEY_EVENT = new pkg.KeyEvent();

export default class KeyEventUnifier {
    constructor(element, destination) {

        //   Alt + x  was pressed  (for IE11 consider sequence of execution of "alt" and "x" keys)
        //   Chrome/Safari/FF  keydown -> keydown -> keypressed
        // ----------------------------------------------------------------------------------------------------------------------
        //          |     which   |    keyCode   | charCode |      code        |     key        |   keyIdentifier   |  char
        // ----------------------------------------------------------------------------------------------------------------------
        //          |             |              |          |                  |                |                   |
        //  Chrome  |    unicode/ |    unicode/  |   0      |  undefined       |  undefined     | Mnemonic + Unistr |   No
        //          |     code    |     code     |          |                  |                |  "Alt" + "U-0058" |
        //          |   18 + 88   |    18 + 88   |          |                  |                |                   |
        //----------+-----------------------------------------------------------------------------------------------|------------
        //          |             |              |          |                  |                |                   |
        //  IE11    |  unicode/   |  unicode/    |          |                  |                |                   |  Alt => ""
        //          |   code      |    code      |    0     |   undefined      |   "Alt","x"    |   undefined       |  x => "x"
        //          |    18, 88   |   18, 88     |          |                  |                |                   |
        //          |             |              |          |                  |                |                   |
        //----------+-------------|--------------|----------|------------------|----------------|-------------------|------------
        //          |   unicode/  |   unicode/   |          |                  |                |                   |
        //          |   code      |     code     |    0     |  undefined       | undefined      | Mnemonic + Unistr |   No
        //  Safari  |   18 + 88   |   18 + 88    |          |                  |                |  "Alt" + "U-0058" |
        //          |             |              |          |                  |                |                   |
        //----------+-----------------------------------------------------------------------------------------------|------------
        //          |             |              |          |                  |                |                   |
        //  FF      |   unicode/  |   unicode/   |    0     |  Mnemonic        | Mnemonic/char  |                   |  No
        //          |    code     |     code     |          |("AltLeft"+"KeyX")|  "Alt"+"≈"     |   undefined       |
        //          |  18 + 88    |  18 + 88     |          |                  |                |                   |
        //
        element.onkeydown = function(e) {
            KEY_EVENT.$fillWith(e);
            var code = $keyPressedCode = KEY_EVENT.code;
            //!!!!
            // TODO: hard coded constants
            // Since container of zCanvas catch all events from its children DOM
            // elements don't prevent the event for the children DOM element
            if (destination.$keyPressed(KEY_EVENT) === true ||
                (code != 13 &&
                  code < 47  &&
                  code != 32 &&
                e.target === element))
            {
                e.preventDefault();
            }

            e.stopPropagation();
        };

        element.onkeyup = function(e) {
            $keyPressedCode = -1;
            if (destination.$keyReleased(KEY_EVENT.$fillWith(e)) === true) {
                e.preventDefault();
            }
            e.stopPropagation();
        };

        //   Alt + x  was pressed  (for IE11 consider sequence of execution of "alt" and "x" keys)
        // ----------------------------------------------------------------------------------------------------------------------
        //          |     which   |    keyCode   | charCode |      code        |     key        |   keyIdentifier   |  char
        // ----------------------------------------------------------------------------------------------------------------------
        //          |             |              |          |                  |                |                   |
        //  Chrome  |    unicode/ |    unicode/  |   8776   |  undefined       |  undefined     | Mnemonic + Unistr |   No
        //          |     code    |     code     |   (≈)    |                  |                |     "U-0058"      |
        //          |   8776 (≈)  |    8776 (≈)  |          |                  |                |                   |
        //----------+-----------------------------------------------------------------------------------------------|------------
        //          |             |              |          |                  |                |                   |
        //  IE11    |  unicode/   |  unicode/    |          |                  |                |                   |
        //          |   code      |    code      |  88 (x)  |   undefined      |     "x"        |   undefined       |   "x"
        //          |    88 (x)   |   88 (x)     |          |                  |                |                   |
        //          |             |              |          |                  |                |                   |
        //----------+-------------|--------------|----------|------------------|----------------|-------------------|------------
        //          |   unicode/  |   unicode/   |          |                  |                |                   |
        //          |   code      |     code     | 8776 (≈) |  undefined       | undefined      |                   |   No
        //  Safari  |   8776 (≈)  |   8776 (≈)   |          |                  |                |        ""         |
        //          |             |              |          |                  |                |                   |
        //----------+-----------------------------------------------------------------------------------------------|------------
        //          |             |              |          |                  |                |                   |
        //  FF      |   unicode/  |    0         |   8776   |  Mnemonic        | Mnemonic/char  |                   |   No
        //          |    code     |              |   (≈)    |  ("KeyX")        |      "≈"       |   undefined       |
        //          |  8776 (≈)   |              |          |                  |                |                   |
        //
        element.onkeypress = function(e) {
            KEY_EVENT.$fillWith(e);

            var code = KEY_EVENT.code;
            if (KEY_EVENT.ch === 0) {
                // wrap with try catch to restore variable
                try {
                    if ($keyPressedCode != code) {
                        if (destination.$keyPressed(KEY_EVENT) === true) {
                            e.preventDefault();
                        }
                    }
                }
                catch(ee) {
                    $keyPressedCode = -1;
                    throw ee;
                }
                $keyPressedCode = -1;
            }
            else {
                // Since container of zCanvas catch all events from its children DOM
                // elements don't prevent the event for the children DOM element
                if (destination.$keyTyped(KEY_EVENT) === true || (e.target === element && code < 47 && code != 32)) {
                    e.preventDefault();
                }
            }

            e.stopPropagation();
        };
    }
}