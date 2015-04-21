Point = function (r, g, b, label) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.label = label;
};

Point.prototype = {
  dist: function(p) {
    var r = Math.abs(p.r - this.r);
    var g = Math.abs(p.g - this.g);
    var b = Math.abs(p.b - this.b);

    return Math.sqrt(r * r + g * g + b * b);
  }
};

module.exports = Point;