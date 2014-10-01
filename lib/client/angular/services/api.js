var _ = require('underscore');
var Emitter = require('event-emitter');

var ChainableEmitter = function(emitter) {
  var ret = {
    on: function() {
      emitter.on.apply(emitter, arguments);
      return ret;
    },
    once: function() {
      emitter.once.apply(emitter, arguments);
      return ret;
    }
  };
  return ret;
};

module.exports = function($http, $window, $timeout) {
  var ret = {};

  var interceptors = [];
  var postedData = [];

  _.each(['get', 'post', 'put'], function(verb) {
    ret[verb] = function(url, p1, p2) {
      var emitter = new Emitter();
      if (interceptors.length > 0) {
        var found = false;
        for (var i = 0; i < interceptors.length; ++i) {
          if (verb === interceptors[i].verb &&
              (interceptors[i].url.test ?
                interceptors[i].url.test(url) :
                interceptors[i].url === url)) {

            (function(i) {
              $timeout(function() {
                if (verb === 'post') {
                  postedData.push(p1);
                }

                emitter.emit('success', interceptors[i].response);
              }, 0);
            })(i);
            return ChainableEmitter(emitter);
          }
        }
      }

      $http[verb](url, p1, p2).
        success(function(data) {
          emitter.emit('success', data);
        }).
        error(function(data) {
          if (data.redirect) {
            return $window.location.href = data.redirect;
          }
          emitter.emit('error', data);
        });
      return ChainableEmitter(emitter);
    };
  });

  ret.interceptors = interceptors;
  ret.postedData = postedData;
  ret.intercept = function(verb, url, response, callback) {
    interceptors.unshift({
      verb: verb,
      url: url,
      response: response,
      callback: callback
    });
  };

  $window.axlAPI = ret;

  return ret;
};