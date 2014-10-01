module.exports = function($scope, $api, $location) {
  var project = $location.search().name.toString();

  $scope.project = {};
  $scope.releases = [];
  $api.get('/api/project?project=' + encodeURIComponent(project)).on('success', function(data) {
    $scope.project = data.project;
    $scope.releases = data.releases;
  });
}