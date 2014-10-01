module.exports = function($scope, $api) {
  $scope.results = [];
  $scope.loading = false;
  $scope.init = false;

  $scope.search = function(q) {
    $scope.init = true;
    $scope.loading = true;
    $api.
      get('/api/search?q=' + encodeURIComponent(q)).
      on('success', function(data) {
        $scope.results = data.projects;
        $scope.loading = false;
      }).
      on('error', function(data) {
        console.log(data);
        $scope.loading = false;
      });
  };
};