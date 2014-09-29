module.exports = function($http) {
  var ret = {};
  ret.projects = [];
  ret.loadProjects = function() {
    $http.
      get('/api/me/projects').
      success(function(data) {
        ret.projects = data.projects;
      }).
      error(function(data) {
        console.log('Error: ' + JSON.stringify(data));
      });
  };

  ret.loadProjects();
  return ret;
};