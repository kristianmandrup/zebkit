class Rgb {
    paint(g,x,y,w,h,d) {
      if (this.s != g.fillStyle) {
          g.fillStyle = this.s;
      }

      // fix for IE10/11, calculate intersection of clipped area
      // and the area that has to be filled. IE11/10 have a bug
      // that triggers filling more space than it is restricted
      // with clip
      if (g.$states != null) {
          var t  = g.$states[g.$curState],
              rx = x > t.x ? x : t.x,
              rw = Math.min(x + w, t.x + t.width) - rx;

          if (rw > 0)  {
              var ry = y > t.y ? y : t.y,
              rh = Math.min(y + h, t.y + t.height) - ry;

              if (rh > 0) g.fillRect(rx, ry, rw, rh);
          }
      }
      else {
          g.fillRect(x, y, w, h);
      }
  }

  // utils.rgb.prototype.
  getPreferredSize = function() {
      return { width:0, height:0 };
  }
}


