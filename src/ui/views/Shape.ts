class Shape extends View {
    function $prototype() {
        this.color = "gray";
        this.gap   = this.width = 1;

        this.paint = function(g,x,y,w,h,d) {
            if (g.lineWidth !== this.width) {
                g.lineWidth = this.width;
            }

            this.outline(g,x,y,w,h,d);
            g.setColor(this.color);
            g.stroke();
        };

        this[''] = function (c, w){
            if (arguments.length > 0) this.color = c;
            if (arguments.length > 1) this.width = this.gap = w;
        };
    }
}
