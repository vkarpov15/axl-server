var knox = require('knox');

module.exports = function(config) {
  var config = {
    key: config.s3.key,
    secret: config.s3.secret,
    bucket: config.s3.bucket
  };

  var client = knox.createClient(config);

  return function(path, length, callback) {
    var headers = {
      'Content-Length': length,
      'x-amz-acl': 'public-read'
    };
    return client.put('/releases' + path, headers);
  };
};