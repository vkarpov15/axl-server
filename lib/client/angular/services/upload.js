module.exports = function($api) {
  return function(file, uploadUrl, callback) {
    var fd = new FormData();
    fd.append('file', file);
    $api.post(
      uploadUrl,
      fd,
      {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }).
      on('success', function(data) {
        callback(null, data);
      }).
      on('error', function(data) {
        callback(data, null);
      });
  };
};