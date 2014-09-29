module.exports = function(di) {
  var db = require('../models')(di);

  di.assemble([
    [
      { name: 'nodePackage', obj: require('../../package.json') },
      { name: 'fs', obj: require('fs') },
      { name: 'CloudfrontConverter', factory: require('../isomorphic/CloudfrontConverter') },
      { name: 'PipeToS3', factory: require('./services/PipeToS3') }
    ]
  ]);
};