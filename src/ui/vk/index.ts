export const $vk = null;

export const makeEditorVisible = true;

var tooltip = null;

export const showVK = function(input) {
    pkg.$vk.show(input);
};

export const getVK = function() {
    return pkg.$vk;
};

export const createVKey = function(d) {
    if (zebkit.isString(d)) {
        if (pkg.PredefinedVKey[d.toLowerCase()] != null) {
            d = pkg.PredefinedVKey[d.toLowerCase()];
        }
        else {
            if (d.length > 1) return new pkg.VKeys(d);
        }
    }
    else {
        if (Array.isArray(d)) {
            return d.length === 1 ? new pkg.VKey (d[0])
                                    : new pkg.VKeys(d);
        }
        else {
            if (d.hasOwnProperty("vkey")) {
                return d["vkey"];
            }
        }
    }

    return new pkg.VKey(d);
};



pkg.activateVK = function() {
    pkg.$vk = new pkg.VK();
    return pkg.$vk;
};

function $isVkElement(c) {
    var p = c;
    while (p != null && p.$isVkElement != true) p = p.parent;
    return p != null;
}

ui.events.bind({
    focusGained : function (e) {
        if (pkg.$vk != null && $isVkElement(e.source) === false && e.source.vkMode != null) {
            pkg.showVK(zebkit.instanceOf(e.source, ui.TextField) ? e.source : null);
        }
    },

    pointerPressed : function(e) {
        if (pkg.$vk != null) {
            if (pkg.$vk.parent != null &&
                $isVkElement(e.source) === false &&
                zebkit.layout.isAncestorOf(pkg.$vk, e.source) === false)
            {
                pkg.showVK(null);
            }

            // if input component holds focus, virtual keyboard is
            // hidden and we press on the input component
            if (pkg.$vk.parent == null && e.source.vkMode != null) {
                pkg.showVK(e.source);
            }
        }
    }
});

new ui.Bag(pkg).load(pkg.$url + "ui.vk.json", function(e) {
    if (e != null) {
        console.log("VK JSON loading failed: " + (e.stack ? e.stack : e));
    }
});

