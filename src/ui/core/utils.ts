import Bag from './Bag';

// keep pointer owners (the component where cursor/finger placed in)
export const $pointerOwner = {};
export const $pointerPressedOwner = {};


export const load = function(path, callback) {
    return new Bag().load(path, callback);
};


export const $getPS = function(l) {
    return l != null && l.isVisible === true ? l.getPreferredSize()
                                             : { width:0, height:0 };
};

export const $cvp = function(c, r) {
    if (c.width > 0 && c.height > 0 && c.isVisible === true){
        var p = c.parent, px = -c.x, py = -c.y;
        if (r == null) {
            r = { x:0, y:0, width : c.width, height : c.height };
        } else {
            r.x = r.y = 0;
            r.width  = c.width;
            r.height = c.height;
        }


        while (p != null && r.width > 0 && r.height > 0) {
            var xx = r.x > px ? r.x : px,
                yy = r.y > py ? r.y : py,
                w1 = r.x + r.width,
                w2 = px  + p.width,
                h1 = r.y + r.height,
                h2 = py + p.height;

            r.width  = (w1 < w2 ? w1 : w2) - xx,
            r.height = (h1 < h2 ? h1 : h2) - yy;
            r.x = xx;
            r.y = yy;

            px -= p.x;
            py -= p.y;
            p = p.parent;
        }

        return r.width > 0 && r.height > 0 ? r : null;
    }
    return null;
};

export const makeFullyVisible = function(d,c){
    if (arguments.length === 1) {
        c = d;
        d = c.parent;
    }

    var right  = d.getRight(),
        top    = d.getTop(),
        bottom = d.getBottom(),
        left   = d.getLeft(),
        xx     = c.x,
        yy     = c.y;

    if (xx < left) xx = left;
    if (yy < top)  yy = top;
    if (xx + c.width > d.width - right) xx = d.width + right - c.width;
    if (yy + c.height > d.height - bottom) yy = d.height + bottom - c.height;
    c.setLocation(xx, yy);
};

export const calcOrigin = function(x,y,w,h,px,py,t,tt,ll,bb,rr){
    if (arguments.length < 8) {
        tt = t.getTop();
        ll = t.getLeft();
        bb = t.getBottom();
        rr = t.getRight();
    }

    var dw = t.width, dh = t.height;
    if (dw > 0 && dh > 0){
        if (dw - ll - rr > w){
            var xx = x + px;
            if (xx < ll) px += (ll - xx);
            else {
                xx += w;
                if (xx > dw - rr) px -= (xx - dw + rr);
            }
        }
        if (dh - tt - bb > h){
            var yy = y + py;
            if (yy < tt) py += (tt - yy);
            else {
                yy += h;
                if (yy > dh - bb) py -= (yy - dh + bb);
            }
        }
        return [px, py];
    }
    return [0, 0];
};