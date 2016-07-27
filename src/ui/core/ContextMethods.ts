export default class $ContextMethods {
    $curState: any;
    $states: any[];

    reset(w, h) {
        this.$curState = 0;
        var s = this.$states[0];
        s.srot = s.rotateVal = s.x = s.y = s.width = s.height = s.dx = s.dy = 0;
        s.crot = s.sx = s.sy = 1;
        s.width = w;
        s.height = h;
        this.setFont(pkg.font);
        this.setColor("white");
    }

    $init() {
        // pre-allocate canvas save $states
        this.$states = Array(50);
        for(var i=0; i < this.$states.length; i++) {
            var s = {};
            s.srot = s.rotateVal = s.x = s.y = s.width = s.height = s.dx = s.dy = 0;
            s.crot = s.sx = s.sy = 1;
            this.$states[i] = s;
        }
    }

    translate(dx, dy) {
        if (dx !== 0 || dy !== 0) {
            var c = this.$states[this.$curState];
            c.x  -= dx;
            c.y  -= dy;
            c.dx += dx;
            c.dy += dy;
            this.$translate(dx, dy);
        }
    }

    rotate(v) {
        var c = this.$states[this.$curState];
        c.rotateVal += v;
        c.srot = Math.sin(c.rotateVal);
        c.crot = Math.cos(c.rotateVal);
        this.$rotate(v);
    }

    scale(sx, sy) {
        var c = this.$states[this.$curState];
        c.sx = c.sx * sx;
        c.sy = c.sy * sy;
        this.$scale(sx, sy);
    }

    save() {
        this.$curState++;
        var c = this.$states[this.$curState], cc = this.$states[this.$curState - 1];
        c.x = cc.x;
        c.y = cc.y;
        c.width = cc.width;
        c.height = cc.height;

        c.dx = cc.dx;
        c.dy = cc.dy;
        c.sx = cc.sx;
        c.sy = cc.sy;
        c.srot = cc.srot;
        c.crot = cc.crot;
        c.rotateVal = cc.rotateVal;

        this.$save();
        return this.$curState - 1;
    }

    restoreAll() {
        while(this.$curState > 0) {
            this.restore();
        }
    }

    restore() {
        if (this.$curState === 0) {
            throw new Error("Context restore history is empty");
        }

        this.$curState--;
        this.$restore();
        return this.$curState;
    }

    clipRect(x,y,w,h){
        var c = this.$states[this.$curState];
        if (c.x != x || y != c.y || w != c.width || h != c.height) {
            var xx = c.x, yy = c.y,
                ww = c.width,
                hh = c.height,
                xw = x + w,
                xxww = xx + ww,
                yh = y + h,
                yyhh = yy + hh;

            c.x      = x > xx ? x : xx;
            c.width  = (xw < xxww ? xw : xxww) - c.x;
            c.y      = y > yy ? y : yy;
            c.height = (yh < yyhh ? yh : yyhh) - c.y;

            if (c.x != xx || yy != c.y || ww != c.width || hh != c.height) {
                // begin path is very important to have proper clip area
                this.beginPath();
                this.rect(x, y, w, h);
                this.closePath();
                this.clip();
            }
        }
    }
}