import ui from '../';

export default class ShaperBorder extends ui.View {
    function $prototype() {
        this.color = "blue";
        this.gap   = 7;

        function contains(x, y, gx, gy, ww, hh) {
            return gx <= x && (gx + ww) > x && gy <= y && (gy + hh) > y;
        }

        this.paint = function(g,x,y,w,h,d){
            var cx = Math.floor((w - this.gap)/2),
                cy = Math.floor((h - this.gap)/2);

            g.setColor(this.color);
            g.beginPath();
            g.rect(x, y, this.gap, this.gap);
            g.rect(x + cx, y, this.gap, this.gap);
            g.rect(x, y + cy, this.gap, this.gap);
            g.rect(x + w - this.gap, y, this.gap, this.gap);
            g.rect(x, y + h - this.gap, this.gap, this.gap);
            g.rect(x + cx, y + h - this.gap, this.gap, this.gap);
            g.rect(x + w - this.gap, y + cy, this.gap, this.gap);
            g.rect(x + w - this.gap, y + h - this.gap, this.gap, this.gap);
            g.fill();

            g.beginPath();

            // very strange thing with rect() method if it called with w or h
            // without decreasing with gap it is ok, otherwise moving   a
            // component with the border outside parent component area leaves
            // traces !
            //
            // adding 0.5 (to center line) solves the problem with traces
            g.rect(x + Math.floor(this.gap / 2) + 0.5,
                   y + Math.floor(this.gap / 2) + 0.5,
                   w - this.gap,
                   h - this.gap );

            g.stroke();
        };

        this.detectAt = function(target,x,y) {
            if (contains(x, y, this.gap, this.gap, target.width - 2 * this.gap, target.height - 2 * this.gap)) {
                return "center";
            }

            if (contains(x, y, 0, 0, this.gap, this.gap)) {
                return "topLeft";
            }

            if (contains(x, y, 0, target.height - this.gap, this.gap, this.gap)) {
                return "bottomLeft";
            }

            if (contains(x, y, target.width - this.gap, 0, this.gap, this.gap)) {
                return "topRight";
            }

            if (contains(x, y, target.width - this.gap, target.height - this.gap, this.gap, this.gap)) {
                return "bottomRight";
            }

            var mx = Math.floor((target.width - this.gap)/2);
            if (contains(x, y, mx, 0, this.gap, this.gap)) {
                return "top";
            }

            if (contains(x, y, mx, target.height - this.gap, this.gap, this.gap)) {
                return "bottom";
            }

            var my = Math.floor((target.height - this.gap)/2);
            if (contains(x, y, 0, my, this.gap, this.gap)) {
                return "left";
            }

            return contains(x, y, target.width - this.gap, my, this.gap, this.gap) ? "right"
                                                                                   : "none";
        };
    }
}
