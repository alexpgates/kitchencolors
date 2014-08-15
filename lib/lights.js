var q = require('q'),
  hue = require('hue.js'),
  config = require('../config.json'),
  colors = require('./colors'),
  log = require('./LogUtils');

var lights = {
  register: function() {
    var deferred = q.defer();
    var hueIp = config.hue.ip;
    var appName = config.hue['app_name'];
    var client = hue.createClient({
      stationIp: hueIp,
      appName: appName
    });

    log.logtrace('Go and press the link button on your base station!');
    client.register(function(err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(client);
      }
    });
    return deferred.promise;
  },
  light: function(client, color) {
    var deferred = q.defer();
    var light = config.hue['light_number'];
    var rgb = colors.torgb(color);
    client.rgb(light, rgb[0], rgb[1], rgb[2], function(err, data) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(data);
      }
    });
    return deferred.promise;
  }
};

module.exports = lights;
