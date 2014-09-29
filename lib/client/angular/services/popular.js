module.exports = function($http) {
  var ret = {};

  ret.data = {};
  ret.load = function() {
    $http.
      get('/api/popular/month').
      success(function(data) {
        ret.data = data.projects;
      }).
      error(function(data) {
        console.log('Error: ' + JSON.stringify(data));
      });
  };

  ret.load();
  return ret;
};