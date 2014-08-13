//taken from https://github.com/bahamas10/hue-cli/blob/master/hue-cli.js
function todec(h, i) {
  return parseInt(h + '' + i, 16);
}

function hex2rgb(hex) {
  if (hex[0] === '#') hex = hex.slice(1);
  var r, g, b;

  if (hex.length === 3) {
    r = todec(hex[0], hex[0]);
    g = todec(hex[1], hex[1]);
    b = todec(hex[2], hex[2]);
  } else {
    r = todec(hex[0], hex[1]);
    g = todec(hex[2], hex[3]);
    b = todec(hex[4], hex[5]);
  }

  return [r, g, b];
}

var csscolors = require('css-color-names');
module.exports = {
  torgb: function(color) {
    var hex = csscolors[color] || color;
    return hex2rgb(hex);
  }
};
