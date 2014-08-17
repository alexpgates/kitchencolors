var q = require('q'),
  hue = require('hue.js'),
  config = require('../config.json'),
  colors = require('./colors'),
  LogUtils = require('./LogUtils');

var lights = {
  register: function() {
    var deferred = q.defer();
    var hueIp = config.hue.ip;
    var appName = config.hue['app_name'];
    var userName = config.hue['user_name'];
    var client = hue.createClient({
      stationIp: hueIp,
      appName: appName
    });

    client.lights(function(err,lights) {

    if (err && err.type === 1) {
      // App has not been registered
      LogUtils.logtrace('Quick! Go press the link button on your Hue base station!', LogUtils.Colors.CYAN);
      client.register(function(err) {

        if (err) {
          LogUtils.logtrace('There was problem registering with your bridge: ' + hueIp , LogUtils.Colors.RED);
          deferred.reject(err);
        } else {
          LogUtils.logtrace('Success! You have connected to the Hue bridge!', LogUtils.Colors.GREEN);
          deferred.resolve(client);
        }
      });
    } else {
      LogUtils.logtrace('Successfully re-connected to the Hue bridge.', LogUtils.Colors.GREEN);
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
