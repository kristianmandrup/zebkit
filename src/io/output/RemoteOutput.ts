import { HTTP } from '../Http';
import Output from './Output';

export default class RemoteOutput extends Output {
    http: HTTP;
    apikey: string;
    buffer: string[];
    $justSaved: boolean;

    constructor(url) {
        super();

        this.http   = new HTTP(url);
        this.apikey = "19751975";
        this.buffer = [];
        this.$justSaved = false;
    }

    query(cmd,args) {
        var s = "apikey=" + this.apikey + "&command=" + cmd;
        if (args != null) {
            for(var k in args) s += "&" + k + "=" + args[k];
        }
        return s;
    }

    print(s,f) { this.out("info", s,f);    }
    error(s,f) { this.out("error", s,f);   }
    warn(s,f) { this.out("warning", s,f); }

    out(l, s, f) {
        if (f == null) {
            this.$justSaved = true;
            this.buffer.push({ level: l, message: s, time:(new Date()).toString() });

            if (this.$timer == null) {
                var $this = this;
                this.$timer = setInterval(function() {
                    if ($this.$justSaved === true) {
                        $this.$justSaved = false;
                        return;
                    }

                    if ($this.buffer.length === 0) {
                        clearInterval($this.$timer);
                        $this.$timer = null;
                        return;
                    }

                    try {
                        var q = $this.query("log", {});
                        for(var i=0; i < $this.buffer.length; i++) {
                            q   += "&level=" + $this.buffer[i]["level"];
                            q   += "&message=" +  $this.buffer[i]["message"];
                            q   += "&time=" + $this.buffer[i]["time"];
                        }
                        $this.buffer.length= 0;

                        var r = $this.http.POST(q).split("\n");
                        if (parseInt(r[0], 10) < 0) throw new Error(r[1]);
                    }
                    catch(e) {
                        alert(e);
                    }
                }, 1500);
            }
        }
        else {
            this.http.POST(this.query("log", { "level"  : l, "message": s, "time": (new Date()).toString() }),
                            function(result, req) {
                                var r = result.split("\n");
                                if (parseInt(r[0], 10) < 0) throw new Error(r[1]);
                                f(r);
                            }
            );
        }
    }

    tail(l) {
        var s = this.query("tail", { startline:l }),
            r = this.http.GET(s).split("\n"),
            c = parseInt(r[0].split(" ")[0], 10);

        if (c < 0) {
            throw new Error(r[1]);
        }

        r.shift();
        r.pop();
        return r;
    };

    clear() {
        var r = this.http.POST(this.query("clear")).split("\n");
        if (parseInt(r[0],10) < 0) {
            throw new Error(r[1]);
        }
    };
}

export const $out  = new Output();
export const print = function() { $out.print.apply($out, arguments); };
export const error = function() { $out.error.apply($out, arguments); };
export const warn  = function() { $out.warn.apply($out, arguments); };

if (typeof console == "undefined") {
    const console = { log   : print,
                error : error,
                debug : print };
}
