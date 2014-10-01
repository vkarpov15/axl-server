angular.scenario.dsl('api', function() {
  return function(verb, path, response, callback) {
    return this.addFutureAction('tweaking api', function(window, document, done) {
      window.axlAPI.intercept(verb, path, response, callback);
      done();
    });
  };
});

angular.scenario.dsl('apiPosted', function() {
  return function(method) {
    var originalArgs = arguments;

    return this.addFutureAction('getting post call', function(window, document, done) {
      if (method === 'count') {
        return done(null, window.axlAPI.postedData.length);
      } else if (method === 'path') {
        var p = originalArgs[1].split('.');
        var o = window.axlAPI.postedData;
        for (var i = 0; i < p.length; ++i) {
          var component = p[i];
          if (!isNaN(parseInt(p[i], 10))) {
            component = parseInt(p[i], 10);
          }
          o = o[component];
        }
        return done(null, o);
      }
      return done('invalid method');
    });
  };
});