/**
 * Tab view class that defines the tab page title and icon
 * @param {String|Image} [icon]  an path to an image or image object
 * @param {String} [caption] a tab caption
 * @class zebkit.ui.Tabs.TabView
 * @extends {zebkit.ui.CompRender}
 * @constructor
 */

import CompRender from './CompRender';

export default class TabView extends CompRender {
    $clazz() {
        this.font = pkg.font;

        this.TabPan = Class(pkg.Panel, [
            function() {
                this.$super();
                this.add(new pkg.ImagePan(null));
                this.add(new pkg.ViewPan());
            },

            function getImagePan() {
                return this.kids[0];
            },

            function getViewPan() {
                return this.kids[1];
            }
        ]);
    },

    function(icon, caption) {
        if (arguments.length === 0) {
            caption = "";
        }
        else {
            if (arguments.length === 1) {
                caption = icon;
                icon = null;
            }
        }

        var tp = new this.clazz.TabPan();
        this.$super(tp);
        this.owner = null;

        var $this = this;
        tp.getImagePan().imageLoaded = function(p, b, i) {
            $this.vrp();

            // if the icon has zero width and height the repaint
            // doesn't trigger validation. So let's do it on
            // parent level
            if ($this.owner != null && $this.owner.parent != null) {
                $this.owner.repaint();
            }
        };

        var r1 = new this.clazz.captionRender(caption),
            r2 = new this.clazz.captionRender(caption);

        r2.setColor(this.clazz.fontColor);
        r1.setColor(this.clazz.selectedFontColor);
        r2.setFont (this.clazz.font);
        r1.setFont (this.clazz.selectedFont);

        this.getCaptionPan().setView(
            new pkg.ViewSet(
                {
                    "selected": r1,
                    "*"       : r2
                },
                [
                    function setFont(id, f) {
                        var v = this.views[id];
                        if (v != null) {
                            v.setFont(s);
                            this.recalc();
                        }
                        return this;
                    },

                    function setCaption(id, s) {
                        var v = this.views[id];
                        if (v != null) {
                            v.setValue(s);
                            this.recalc();
                        }
                        return this;
                    },

                    function getCaption(id) {
                        var v = this.views[id];
                        return v == null ? null : v.getValue();
                    }
                ]
            )
        );

        this.setIcon(icon);
    },

    function ownerChanged(v) {
        this.owner = v;
    },

    function vrp() {
        if (this.owner != null) this.owner.vrp();
    },

    /**
     * Set the given tab caption for the specified tab or both - selected and not selected - states.
     * @param {Boolean} [b] the tab state. true means selected state.
     * @param {String} s the tab caption
     * @method setCaption
     */
    function setCaption(b, s) {
        if (arguments.length === 1) {
            this.setCaption(true, b);
            this.setCaption(false, b);
        } else {
            this.getCaptionPan().view.setCaption(this.$toId(b), s);
            this.vrp();
        }
        return this;
    },

    /**
     * Get the tab caption for the specified tab state
     * @param {Boolean} b the tab state. true means selected state.
     * @return {String} the tab caption
     * @method getCaption
     */
    function getCaption(b) {
        return this.getCaptionPan().view.getCaption(this.$toId(b));
    },

    /**
     * Set the given tab caption text color for the specified tab or both
     * selected and not selected states.
     * @param {Boolean} [b] the tab state. true means selected state.
     * @param {String} c the tab caption
     * @method setColor
     */
    function setColor(b, c) {
        if (arguments.length === 1) {
            this.setColor(true, b);
            this.setColor(false, b);
        } else {
            var v = this.getCaptionPan().view.views[this.$toId(b)];
            if (v != null) {
                v.setColor(c);
                this.vrp();
            }
        }
        return this;
    },

    /**
     * Set the given tab caption text font for the specified or both
     * selected not slected states.
     * @param {Boolean} [b] the tab state. true means selected state.
     * @param {zebkit.ui.Font} f the tab text font
     * @method setFont
     */
    function setFont(b, f) {
        if (arguments.length === 1) {
            this.setFont(true, b);
            this.setFont(false, b);
        } else {
            this.getCaptionPan().view.setFont(this.$toId(b), f);
            this.vrp();
        }
        return this;
    },

    function getCaptionPan() {
        return this.target.getViewPan();
    },

    /**
     * Set the tab icon.
     * @param {String|Image} c an icon path or image object
     * @method setIcon
     */
    function setIcon(c) {
        this.target.getImagePan().setImage(c);
        this.target.getImagePan().setVisible(c != null);
        return this;
    },

    /**
     * The method is invoked every time the tab selection state has been updated
     * @param {zebkit.ui.Tabs} tabs the tabs component the tab belongs
     * @param {Integer} i an index of the tab
     * @param {Boolean} b a new state of the tab
     * @method selected
     */
    function selected(tabs, i, b) {
        this.getCaptionPan().view.activate(this.$toId(b));
    },

    function $toId(b) {
        return b ? "selected" : "*";
    }
}