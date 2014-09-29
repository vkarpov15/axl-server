module.exports = function($scope, $projects, $upload) {
  $scope.projects = $projects;

  $scope.upload = function() {
    $upload($scope.myFile, '/api/release?project=' + encodeURIComponent($scope.project) + '&version=' + encodeURIComponent($scope.version), function(error, data) {
      alert(error);
    });
  };
};