module.exports = function($api, $window) {
  var ret = {};

  ret.data = {};
  ret.load = function() {
    $api.
      get('/api/me').
      on('success', function(data) {
        ret.data = data.user;
      }).
      on('error', function(data) {
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