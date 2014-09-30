module.exports = function($scope, $http, $location) {
  var project = $location.search().name.toString();

  $scope.project = {};
  $scope.releases = [];
  $http.get('/api/project?project=' + encodeURIComponent(project)).success(function(data) {
    $scope.project = data.project;
    $scope.releases = data.releases;
  });
}