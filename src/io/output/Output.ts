import {environment, types} from '../../utils';

export default class Output {
    constructor() {
    }

    print(o) { this._p(0, o); };
    error(o) { this._p(2, o); };
    warn(o)  { this._p(1, o); };

    _p(l, o) {
        o = this.format(o);
        if (environment.isInBrowser) {
            if (typeof console === "undefined" || !console.log) {
                alert(o);
            }
            else {
                if (l === 0) console.log(o);
                else {
                    if (l == 1) console.warn(o);
                    else console.error(o);
                }
            }
        }
        else environment.$global.print(o);
    };

    format(o) {
        if (o && o.stack) return [o.toString(), ":",  o.stack.toString()].join("\n");
        if (o === null) return "<null>";
        if (typeof o === "undefined") return "<undefined>";
        if (types.isString(o) || types.isNumber(o) || types.isBoolean(o)) return o;
        var d = [o.toString() + " " + (o.clazz ? o.clazz.$name:"") , "{"];
        for(var k in o) if (o.hasOwnProperty(k)) d.push("    " + k + " = " + o[k]);
        return d.join('\n') + "\n}";
    }
}