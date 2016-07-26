import InputStream from './InputStream';
import { getMethod } from '../extras';

var isBA = typeof(ArrayBuffer) !== 'undefined';

export default class URLInputStream extends InputStream {
    constructor(url, f) {
        super();

        var r = io.getRequest(), $this = this;
        r.open("GET", url, f !== null);
        if (f === null || isBA === false) {
            if (!r.overrideMimeType) throw new Error("Binary mode is not supported");
            r.overrideMimeType("text/plain; charset=x-user-defined");
        }

        if (f !== null)  {
            if (isBA) r.responseType = "arraybuffer";
            r.onreadystatechange = function() {
                if (r.readyState == 4) {
                    if (r.status != 200)  throw new Error(url);
                    getMethod($this.clazz.$parent, '', 1).call($this, isBA ? r.response : r.responseText); // $this.$super(res);
                    f($this.data, r);
                }
            };
            r.send(null);
        }
        else {
            r.send(null);
            if (r.status != 200) throw new Error(url);
            super(r.responseText);
        }
    }

    close() {
        super.close();
        if (this.data) {
            this.data.length = 0;
            this.data = null;
        }
    }
}
