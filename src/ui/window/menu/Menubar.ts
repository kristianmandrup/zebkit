/**
 * Menu bar UI component class. Menu bar can be build in any part of UI application.
 * There is no restriction regarding the placement of the component.

        var canvas = new zebkit.ui.zCanvas(300,200);
        canvas.setLayout(new zebkit.layout.BorderLayout());

        var mbar = new zebkit.ui.Menubar({
            "Item 1": {
                "Subitem 1.1":null,
                "Subitem 1.2":null,
                "Subitem 1.3":null
            },
            "Item 2": {
                "Subitem 2.1":null,
                "Subitem 2.2":null,
                "Subitem 2.3":null
            },
            "Item 3": null
        });

        canvas.root.add("bottom", mbar);

 * @class zebkit.ui.Menubar
 * @constructor
 * @extends zebkit.ui.Menu
 */

import MenuItem from './MenuItem';
import Label from '../../core/Label';

class MenuItemX extends MenuItem {
    get clazz() {
        return {
            Label: MenuItem.Label
        };
    }

    constructor(c) {
        super(c);
        this.hideSub();
        this.getCheck().setVisible(false);
    }
}


function Clazz() {    
    this.MenuItem = MenuItemX;
}


import Menu from './Menu';

export default class Menubar extends Menu {
    get clazz() {
        return new Clazz();
    }

    $isActive: boolean;

    constructor() {
        super();
        this.$isActive = false;
    }

    triggerSelectionByPos(i) {
        return this.isItemSelectable(i) && this.$isActive === true;
    }

    // making menu bar not removable by overriding the method
    $hideMenu(triggeredBy) {
        var child = this.$childMenu();
        if (child != null) {
            child.$hideMenu(triggeredBy);
        }

        // handle situation when calling hideMenu method has been triggered
        // by a child sub-menu initiate it (an item has been selected or menu
        if (triggeredBy != this) {
            this.select(-1);
        }
    };

    $showSubMenu(menu) {
        var d   = this.getCanvas(),
            k   = this.kids[this.selectedIndex],
            pop = d.getLayer(pkg.PopupLayer.ID);

        if (menu.hasSelectableItems()) {
            var abs = zebkit.layout.toParentOrigin(0,0,k);
            menu.setLocation(abs.x, abs.y + k.height + 1);
            menu.toPreferredSize();
            pop.add(menu);
            menu.requestFocus();
        }
    }

    // static

    $canceled(m) {
        this.select(-1);
    }

    select(i) {
        var d   = this.getCanvas(),
            pop = d != null ? d.getLayer(pkg.PopupLayer.ID) : null;

        if (pop != null) {
            if (i < 0) {
                pop.setMenubar(null);
                this.$isActive = false;
            } else {
                pop.setMenubar(this);
            }
        }
        super.select(i);
    }

    // called when an item is selected by user with pointer click or key
    $select(i) {
        this.$isActive = !this.$isActive;
        if (this.$isActive === false) {
            i = -1;
        }
        super.$select(i);
    }
}