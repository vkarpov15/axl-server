module.exports = function($scope, $api, $location, $user, $projects) {
  $scope.project = new mongoose.Document({}, schemas.Project);

  $scope.save = function() {
    $api.post('/api/project', $scope.project).on('success', function(data) {
      $projects.loadProjects();
      $location.url('/projects');
    });
  };

  $scope.addMaintainer = function(username) {
    $scope.project.data.maintainers.push({ username: username });
  };
};