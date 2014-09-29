module.exports = function($http) {
  return function(file, uploadUrl, callback) {
    var fd = new FormData();
    fd.append('file', file);
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).
    success(function(data) {
      callback(null, data);
    }).
    error(function(data){
      callback(data, null);
    });
  };
};