var assert = require('assert');
var proxyquire = require('proxyquire').noCallThru();
var expect = require('chai').expect;
var q = require('q');

var hue = { };
var lights = proxyquire('../lib/lights', {
  'hue.js': hue
});

var client = {
  callCount: 0,
  register: function(cb) {
    cb();
  },
  rgb: function(light, r, g, b, cb) {
    client.callCount++;
    client.r = r;
    client.g = g;
    client.b = b;
    cb();
  }
};
hue.createClient = function() {
  return client;
};

describe('register', function() {
  it('should have a register command', function() {
    expect(lights.register).not.to.be.undefined;
  });

  it('should return a promise', function() {
    expect(lights.register('5.5.5.5').then).to.be.a('function');
  });

  it('returns a client', function(done) {
    lights.register('5.5.5.5').then(function(c) {
      expect(c).to.equal(client);
      done();
    });
  });
});

describe('light', function() {
  it('has a light function', function() {
    expect(lights.light).to.exist;
  });
  
  it('invokes huejs lights', function() {
    var callCount = client.callCount;
    lights.light(client, 'red');
    expect(client.callCount).to.equal(callCount + 1);
  });

  it('passes the right rgb values', function() {
    lights.light(client, 'red');
    expect([client.r, client.g, client.b]).to.eql([255, 0, 0]);
  });
});
