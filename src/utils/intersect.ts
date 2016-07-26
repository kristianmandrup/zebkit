/**
 * Compute intersection of the two given rectangular areas
 * @param  {Integer} x1 a x coordinate of the first rectangular area
 * @param  {Integer} y1 a y coordinate of the first rectangular area
 * @param  {Integer} w1 a width of the first rectangular area
 * @param  {Integer} h1 a height of the first rectangular area
 * @param  {Integer} x2 a x coordinate of the first rectangular area
 * @param  {Integer} y2 a y coordinate of the first rectangular area
 * @param  {Integer} w2 a width of the first rectangular area
 * @param  {Integer} h2 a height of the first rectangular area
 * @param  {Object}  r  an object to store result
 *
 *      { x: {Integer}, y:{Integer}, width:{Integer}, height:{Integer} }
 *
 * @method intersection
 * @api zebkit.util.intersection();
 */
export const intersection = function(x1,y1,w1,h1,x2,y2,w2,h2,r){
    r.x = x1 > x2 ? x1 : x2;
    r.width = Math.min(x1 + w1, x2 + w2) - r.x;
    r.y = y1 > y2 ? y1 : y2;
    r.height = Math.min(y1 + h1, y2 + h2) - r.y;
};

export const isIntersect = function(x1,y1,w1,h1,x2,y2,w2,h2){
    return (Math.min(x1 + w1, x2 + w2) - (x1 > x2 ? x1 : x2)) > 0 &&
           (Math.min(y1 + h1, y2 + h2) - (y1 > y2 ? y1 : y2)) > 0;
};

export const unite = function(x1,y1,w1,h1,x2,y2,w2,h2,r){
    r.x = x1 < x2 ? x1 : x2;
    r.y = y1 < y2 ? y1 : y2;
    r.width  = Math.max(x1 + w1, x2 + w2) - r.x;
    r.height = Math.max(y1 + h1, y2 + h2) - r.y;
};