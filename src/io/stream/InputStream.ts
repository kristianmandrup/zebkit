import { types } from '../../utils';
import { b64 } from '../';

var isBA = typeof(ArrayBuffer) !== 'undefined';

export default class InputStream {
    data: any;
    marked: any;
    pos: any;

    constructor(container) {
        if (isBA && container instanceof ArrayBuffer) {
            this.data = new Uint8Array(container);
        } else {
            if (types.isString(container)) {
                this.extend([
                    function read() {
                        return this.available() > 0 ? this.data.charCodeAt(this.pos++) & 0xFF : -1;
                    }
                ]);
            }
            else {
                if (Array.isArray(container) === false) {
                    throw new Error("Wrong type: " + typeof(container));
                }
            }
            this.data = container;
        }
        this.marked = -1;
        this.pos    = 0;
    }

    mark() {
        if (this.available() <= 0) throw new Error();
        this.marked = this.pos;
    }

    reset() {
        if (this.available() <= 0 || this.marked < 0) throw new Error();
        this.pos    = this.marked;
        this.marked = -1;
    }

    close()   { this.pos = this.data.length; },

    read(buf, off, len) {
        if (arguments.length === 0) {
            return this.available() > 0 ? this.data[this.pos++] : -1;
        }

        if (off == null) {
            off = 0;
        }

        if (len == null) {
            len = buf.length;
        }

        for(var i = 0; i < len; i++) {
            var b = this.read();
            if (b < 0) return i === 0 ? -1 : i;
            buf[off + i] = b;
        }
        return len;
    }

    readChar() {
        var c = this.read();
        if (c < 0) return -1;
        if (c < 128) return String.fromCharCode(c);

        var c2 = this.read();
        if (c2 < 0) throw new Error();

        if (c > 191 && c < 224) return String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        else {
            var c3 = this.read();
            if (c3 < 0) throw new Error();
            return String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        }
    }

    readLine() {
        if (this.available() > 0)
        {
            var line = [], b;
            while ((b = this.readChar()) != -1 && b != "\n") line.push(b);
            var r = line.join('');
            line.length = 0;
            return r;
        }
        return null;
    }

    available() { return this.data === null ? -1 : this.data.length - this.pos; }
    toBase64() { return b64.b64encode(this.data); }
}
