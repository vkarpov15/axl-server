module.exports = function($api) {
  var ret = {};

  ret.data = {};
  ret.load = function() {
    $api.
      get('/api/popular/month').
      on('success', function(data) {
        ret.data = data.projects;
      }).
      on('error', function(data) {
        console.log('Error: ' + JSON.stringify(data));
      });
  };

  ret.load();
  return ret;
};