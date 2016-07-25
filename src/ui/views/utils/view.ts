import {CompositeView, ViewSet, View} from '../'; // views

export default function $view(v) {
    if (v == null || v.paint != null) {
        return v;
    }

    if (utils.isString(v)) {
        return util.rgb.hasOwnProperty(v) ? zebkit.util.rgb[v]
                                                 : (pkg.borders != null && pkg.borders.hasOwnProperty(v) ? pkg.borders[v]
                                                                                                         : new zebkit.util.rgb(v));
    }

    if (Array.isArray(v)) {
        return new CompositeView(v);
    }

    if (typeof v !== 'function') {
        return new ViewSet(v);
    }

    console.log("Function detected ! " + v);

    var vv = new View();
    vv.paint = v;
    return vv;
}