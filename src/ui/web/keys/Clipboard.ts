export default class Clipboard {
    function $clazz() {
        this.Listeners = zebkit.util.ListenersClass("clipCopy", "clipPaste", "clipCut");
    },

    function $prototype() {
        this.keyPressed = function (e) {
            var focusOwner = pkg.focusManager.focusOwner;
            if (e.code     === this.clipboardTriggerKey &&
                focusOwner !=  null                     &&
                (focusOwner.clipCopy  != null || focusOwner.clipPaste != null))
            {
                this.$clipboard.style.display = "block";
                this.$clipboardCanvas = focusOwner.getCanvas();

                // value has to be set, otherwise some browsers (Safari) do not generate
                // "copy" event
                this.$clipboard.value = "1";

                this.$clipboard.select();
                this.$clipboard.focus();
            }
        };
    },

    function(clipboardTriggerKey) {
        this.clipboardTriggerKey = clipboardTriggerKey;

        function $dupKeyEvent(e, id, target)  {
            var k = new Event(id);
            k.keyCode  = e.keyCode;
            k.key      = e.key;
            k.target   = target;
            k.ctrlKey  = e.ctrlKey;
            k.altKey   = e.altKey;
            k.shiftKey = e.shiftKey;
            k.metaKey  = e.metaKey;
            return k;
        }

        if (clipboardTriggerKey > 0) {
            // TODO: why bind instead of being a manager ?
            pkg.events.bind(this);

            this._ = new this.clazz.Listeners();

            var $clipboard = this.$clipboard = document.createElement("textarea"),
                $this = this;

            $clipboard.setAttribute("style", "display:none;position:fixed;left:-99em;top:-99em;");

            $clipboard.onkeydown = function(ee) {
                $this.$clipboardCanvas.element.dispatchEvent($dupKeyEvent(ee, 'keydown', $this.$clipboardCanvas.element));
                $clipboard.value="1";
                $clipboard.select();
            };

            $clipboard.onkeyup = function(ee) {
                if (ee.keyCode === $this.clipboardTriggerKey) {
                    $clipboard.style.display = "none";
                    $this.$clipboardCanvas.element.focus();
                }

                $this.$clipboardCanvas.element.dispatchEvent($dupKeyEvent(ee, 'keyup', $this.$clipboardCanvas.element));
            };

            $clipboard.onblur = function() {
                this.value="";
                this.style.display="none";

                //!!! pass focus back to canvas
                //    it has to be done for the case when cmd+TAB (switch from browser to
                //    another application)
                $this.$clipboardCanvas.element.focus();
            };

            $clipboard.oncopy = function(ee) {
                if (pkg.focusManager.focusOwner          != null &&
                    pkg.focusManager.focusOwner.clipCopy != null    )
                {
                    var v = pkg.focusManager.focusOwner.clipCopy();
                    $clipboard.value = (v == null ? "" : v);
                    $clipboard.select();
                    $this._.clipCopy(v, $clipboard.value);
                }
            };

            $clipboard.oncut = function(ee) {
                if (pkg.focusManager.focusOwner && pkg.focusManager.focusOwner.cut != null) {
                    $clipboard.value = pkg.focusManager.focusOwner.cut();
                    $clipboard.select();
                    $this._.clipCut(pkg.focusManager.focusOwner, $clipboard.value);
                }
            };

            if (zebkit.isFF === true) {
                $clipboard.addEventListener ("input", function(ee) {
                    if (pkg.focusManager.focusOwner &&
                        pkg.focusManager.focusOwner.clipPaste != null)
                    {
                        pkg.focusManager.focusOwner.clipPaste($clipboard.value);
                        $this._.clipPaste(pkg.focusManager.focusOwner, $clipboard.value);
                    }
                }, false);
            }
            else {
                $clipboard.onpaste = function(ee) {
                    if (pkg.focusManager.focusOwner != null && pkg.focusManager.focusOwner.clipPaste != null) {
                        var txt = (typeof ee.clipboardData == "undefined") ? window.clipboardData.getData('Text')  // IE
                                                                            : ee.clipboardData.getData('text/plain');
                        pkg.focusManager.focusOwner.clipPaste(txt);
                        $this._.clipPaste(pkg.focusManager.focusOwner, txt);
                    }
                    $clipboard.value = "";
                };
            }
            document.body.appendChild($clipboard);
        }
    }
}
