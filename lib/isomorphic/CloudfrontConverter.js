module.exports = function(config) {
  return function(url) {
    if (/^(http[s]?:)?\/\/s3.amazonaws.com\/axl-test/g.test(url)) {
      var tailIndex = url.indexOf('axl-test/') +
        'axl-test/'.length;
      return '//' + config.cloudfront.name + '.cloudfront.net/' +
        url.substr(tailIndex);
    }

    return null;
  };
};