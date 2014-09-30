module.exports = function($scope, $http, $location, $user) {
  $scope.project = new mongoose.Document({}, schemas.Project);

  $scope.save = function() {
    $http.post('/api/project', $scope.project).success(function(data) {
      alert(JSON.stringify(data));
      $location.url('/projects');
    });
  };

  $scope.addMaintainer = function(username) {
    $scope.project.data.maintainers.push({ username: username });
  };
};