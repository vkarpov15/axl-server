module.exports = function($api) {
  var ret = {};
  ret.projects = [];
  ret.loadProjects = function() {
    $api.
      get('/api/me/projects').
      on('success', function(data) {
        ret.projects = data.projects;
      }).
      on('error', function(data) {
        console.log('Error: ' + JSON.stringify(data));
      });
  };

  ret.loadProjects();
  return ret;
};