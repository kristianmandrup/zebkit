// 1) "A" single character key
//   {  ch: "A" }
//
// 2) General virtual key pattern
//   {
//      ch  : <ch>,
//      code: <code>,
//      mask: <mask>,
//      label | view | icon : <?>
//   }
//
// 3) Character shortcut:
// "A"
//
// 4) Multiple single char VK variants:
//    "ABCD"
//
// 5) Multiple character single key
//    [ "AA" ]  or with variants [ "AA", ["BB"], ["CC"] ]
//

import VKeyBase from './VKeyBase';

export default class VKey extends VKeyBase {
    constructor() {
        super();
        this.$sticked = false;

        this.$syncMask = function(m) {
            if (this.mask != null) {
                var isOn = this.mask & m;
                if (isOn != this.$sticked) {
                    this.$sticked = !this.$sticked;
                    this.setState(this.$sticked ? 3 : 2);
                    this.nextStatusView();
                }
            }
        };

        this.catchFired = function() {
            if (this.ch != null) {
                this.fireVkTyped(this.code, this.ch, this.mask);
            }
            else {
                // handle period keys
                if (this.firePeriod > 0 &&
                    this.repeatTask != null &&
                    this.repeatTask.isStarted === true)
                {

                    this.fireVkPressed(this.code, this.ch, this.mask);
                }
            }
        };

        this.fireVkTyped = function(code, ch, mask) {
            var vk = this.findVK("vkTyped");
            if (vk != null) {
                vk.vkTyped(this, code, ch, mask);
            }
        };

        this.fireVkReleased = function(code, ch, mask) {
            this.hideHint();

            var vk = this.findVK("vkReleased");
            if (vk != null) {
                vk.vkReleased(this, code, ch, mask);
            }
        };

        this.fireVkPressed = function(code, ch, mask) {
            var vk = this.findVK("vkPressed");
            if (vk != null) {
                vk.vkPressed(this, code, ch, mask);
            }

            if (ch != null && this.hint !== null) {
                this.showHint(this.hint !== null ? ch : this.hint);
            }
        };

        this.upperCase = function() {
            if (this.ch != null) {
                var l = this.getLabel();
                if (l != null && l.toLowerCase() === this.ch.toLowerCase()) {
                    this.setLabel(l.toUpperCase());
                }
            }
        };

        this.lowerCase = function() {
            if (this.ch != null) {
                var l = this.getLabel();
                if (l != null && l.toLowerCase() === this.ch.toLowerCase()) {
                    this.setLabel(l.toLowerCase());
                }
            }
        };
    },

    function(t) {
        if (zebkit.isString(t)) {
            t = { ch : t };
        }

        this.ch   = t.ch == null ? null : t.ch;
        this.mask = t.mask == null ? 0 : t.mask;
        this.code = (t.code == null) ? 0 : t.code;

        if (typeof t.hint != "undefined") {
            this.hint = t.hint;
        }

        if (t.repeat != null) {
            this.setFireParams(true, t.repeat);
        }

        this.$super(t.view || t.icon || t.label || this.ch);
    },

    function _pointerPressed(e) {
        if (this.$sticked == true) {
            this.$sticked = false;
            this.$getSuper("_pointerReleased").call(this, e);
            this.fireVkReleased(this.code, this.ch, this.mask);
        }
        else {
            this.$super(e);
            this.fireVkPressed(this.code, this.ch, this.mask);
            if (this.mask !== 0) {
                this.$sticked = true;
            }
        }
    },

    function _pointerReleased(e) {
        if (this.mask === 0) {
            this.$super(e);
            this.fireVkReleased(this.code, this.ch, this.mask);
        }
    }
}