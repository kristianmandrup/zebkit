export default class VKeyOption extends VKeyBase {
    function $clazz() {
        this.Menu = Class(ui.Menu, [
            function $prototype() {
                this.canHaveFocus = false;
            }
        ]);
    },

    function $prototype() {
        this.catchFired = function() {
            if (this.menu.parent != null) {
                this.menu.removeMe();
            } else {
                var o = zebkit.layout.toParentOrigin(this);
                this.menu.select(-1);
                this.menu.toPreferredSize();
                this.menu.setLocation(o.x, o.y - this.menu.height);
                ui.showPopupMenu(this, this.menu);
            }
        };
    },

    function (v, options) {
        this.$super(v);
        this.menu = new this.clazz.Menu(options);
        this.menu.toPreferredSize();
        this.menu.$isVkElement = true;


        this.options = options.slice(0);
        var $this = this;
        this.menu.bind(function(src, i) {
            if (src.selectedIndex >= 0) {
                var vk = $this.findVK("vkOptionSelected");
                if (vk != null) {
                    vk.vkOptionSelected($this,
                                        src.selectedIndex,
                                        $this.options[src.selectedIndex]);
                }
            }
        });
    }
}