import { types } from '../utils';

export default class Data {
    descent(a : any, b : any) {
        if (a == null) return 1;
        return types.isString(a) ? a.localeCompare(b) : a - b;
    }

    ascent(a : any, b : any) {
        if (b == null) return 1;
        return types.isString(b) ? b.localeCompare(a) : b - a;
    }
}
