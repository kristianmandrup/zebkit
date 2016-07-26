export { default as ArrowView } from './ArrowView';
export { default as BaseTextRender } from './BaseTextRender';
export { default as BoldTextRender } from './BoldTextRender';
export { default as Border } from './Border';
export { default as BundleView } from './BundleView';
export { default as CaptionBgView } from './CaptionBgView';

import CompositeView from './CompositeView';
import ViewSet from './ViewSet'
import View from './View';

import {rgb, Rgb} from '../../utils/rgb';
import borders from '../../utils/borders';
import types from '../types';


export function $view(v) {
    if (v == null || v.paint != null) {
        return v;
    }

    if (types.isString(v)) {
        return rgb.hasOwnProperty(v) ? rgb[v]
                                                 : (borders != null && borders.hasOwnProperty(v) ? borders[v] : new Rgb(v));
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