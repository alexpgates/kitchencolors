var assert = require('assert');
var expect = require('chai').expect;

var colors = require('../lib/colors');

describe('colors', function() {
  it('returns a 3 item array', function() {
    var rgb = colors.torgb('red');
    expect(rgb).to.be.an('array');
    expect(rgb.length).to.equal(3);
  });

  it('turns 6 digit hex values into rgb', function() {
    var rgb = colors.torgb('FFFFFF');
    expect(rgb).to.eql([255, 255, 255]);
  });

  it('works with lots of hex values', function() {
    expect(colors.torgb('00FF00')).to.eql([0, 255, 0]);
    expect(colors.torgb('#00FF00')).to.eql([0, 255, 0]);
    expect(colors.torgb('#0F0')).to.eql([0, 255, 0]);
    expect(colors.torgb('0F0')).to.eql([0, 255, 0]);
  });

  it('also works with css colors', function() {
    expect(colors.torgb('red')).to.eql([255, 0, 0]);
    expect(colors.torgb('papayawhip')).to.eql([255, 239, 213]);
    expect(colors.torgb('rebeccapurple')).to.eql([102, 51, 153]);
  });
});
