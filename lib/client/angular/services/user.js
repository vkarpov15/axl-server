module.exports = function($http, $window) {
  var ret = {};

  ret.data = {};
  ret.load = function() {
    $http.
      get('/api/me').
      success(function(data) {
        ret.data = data.user;
      }).
      error(function(data) {
        if (data.redirect) {
          $window.location.href = 'data.redirect';
        } else {
          console.log('Error: ' + JSON.stringify(data));
        }
      });
  };

  ret.load();
  return ret;
};