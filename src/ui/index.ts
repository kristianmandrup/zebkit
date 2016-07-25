export { default as ArrowButton } from './ArrowButton';
export { default as BoldLabel } from './BoldLabel';
export { default as Bootstrap } from './Bootstrap';
export { default as BorderPan } from './BorderPan';
export { default as Button } from './Button';
export { default as ButtonRepeatMix } from './ButtonRepeatMix';
export { default as Checkbox } from './Checkbox';
export { default as ComEvStatePan } from './CompEvStatePan';
export { default as EvStatePan } from './EvStatePan';
export { default as ExtendablePan } from './ExtendablePan';
export { default as Group } from './Group';
export { default as ImageLabel } from './ImageLabel';
export { default as Label } from './Label';
export { default as Line } from './Line';
export { default as Link } from './Link';
export { default as MobileScrollMan } from './MobileScrollMan';
export { default as Progress } from './Progress';
export { default as RadioBox } from './RadioBox';
export { default as Scroll } from './Scroll';
export { default as ScrollManager } from './ScrollManager';
export { default as ScrollPan } from './ScrollPan';
export { default as Slider } from './Slider';
export { default as SplitPan } from './SplitPan';
export { default as StackPan } from './StackPan';
export { default as StatusBar } from './StatusBar';
export { default as Switchable } from './Switchable';
export { default as SwitchManager } from './SwitchManager';
export { default as Tabs } from './Tabs';
export { default as TabView } from './TabView';
export { default as Toolbar } from './Toolbar';
export { default as VideoPan } from './VideoPan';

// export { * as web } from './web';

/**
 * @module  ui
 */
export const $ViewsSetterMix = zebkit.Interface([
    function $prototype() {
        this.setViews = function(v){
            if (this.views == null) {
                this.views = {};
            }

            var b = false;
            for(var k in v) {
                if (v.hasOwnProperty(k)) {
                    var nv = pkg.$view(v[k]);
                    if (this.views[k] !== nv) {
                        this.views[k] = nv;
                        b = true;
                    }
                }
            }

            if (b) {
                this.vrp();
            }

            return this;
        };
    }
]);


export const $component = function(desc, instance) {
    if (zebkit.isString(desc)) {
        //  [x] Text
        //  @(image-path:wxh) Text
        //  Text

        var m = desc.match(/^(\[[x ]?\])/);
        if (m != null) {
            var txt = desc.substring(m[1].length),
                ch  = instance != null && instance.clazz.Checkbox != null ? new instance.clazz.Checkbox(txt)
                                                                          : new pkg.Checkbox(txt);
            ch.setValue(m[1].indexOf('x') > 0);
            return ch;
        } else {
            var m = desc.match(/^@\((.*)\)(\:[0-9]+x[0-9]+)?/);
            if (m != null) {
                var path = m[1],
                    txt  = desc.substring(path.length + 3 + (m[2] != null ? m[2].length : 0)).trim(),
                    img  = instance != null && instance.clazz.ImagePan != null ? new instance.clazz.ImagePan(path)
                                                                               : new pkg.ImagePan(path);

                if (m[2] != null) {
                    var s = m[2].substring(1).split('x'),
                        w = parseInt(s[0], 10),
                        h = parseInt(s[1], 10);

                    img.setPreferredSize(w, h);
                }

                if (txt.length == 0) {
                    return img;
                }

                return instance != null && instance.clazz.ImageLabel != null ? new instance.clazz.ImageLabel(txt, img)
                                                                             : new pkg.ImageLabel(txt, img);
            } else {
                return instance != null && instance.clazz.Label != null ? new instance.clazz.Label(desc)
                                                                        : new pkg.Label(desc);
            }
        }
    } else if (Array.isArray(desc)) {
        if (desc.length > 0 && Array.isArray(desc[0])) {
            var model = new zebkit.data.Matrix(desc.length, desc[0].length);
            for(var row = 0; row < model.rows; row++) {
                for(var col = 0; col < model.cols; col++) {
                    model.put(row, col, desc[row][col]);
                }
            }
            return new pkg.grid.Grid(model);
        } else {
            var clz = instance != null && instance.clazz.Combo != null ? instance.clazz.Combo
                                                                       : pkg.Combo,
                combo = new clz(new clz.CompList(true)),
                selectedIndex = -1;

            for(var i = 0; i < desc.length; i++) {
                var s = desc[i];
                if (zebkit.isString(s)) {
                    if (selectedIndex === -1 && s.length > 1 && s[0] === '*') {
                        selectedIndex = i;
                        desc[i] = s.substring(1);
                    }
                }
                combo.list.add(pkg.$component(desc[i], combo.list));
            }

            combo.select(selectedIndex);
            return combo;
        }
    } else if (desc instanceof Image) {
        return instance != null && instance.clazz.ImagePan != null ? new instance.clazz.ImagePan(desc)
                                                                   : new pkg.ImagePan(desc);
    } else if (zebkit.instanceOf(desc, pkg.View)) {
        var v = instance != null && instance.clazz.ViewPan != null ? new instance.clazz.ViewPan()
                                                                   : new pkg.ViewPan();
        v.setView(desc);
        return v;
    }

    // TODO: desc
    return desc;
};

