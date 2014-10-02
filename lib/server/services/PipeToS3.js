var knox = require('knox');

module.exports = function(config) {
  if (!config.s3.key || !config.s3.secret) {
    return null;
  }

  var config = {
    key: config.s3.key,
    secret: config.s3.secret,
    bucket: config.s3.bucket
  };

  var client = knox.createClient(config);
  var base = '/releases';

  var ret = function(path, length, callback) {
    var headers = {
      'Content-Length': length,
      'x-amz-acl': 'public-read'
    };
    return client.put(base + path, headers);
  };

  ret.setBase = function(b) {
    base = b;
  };

  return ret;
};