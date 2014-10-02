var mongoose = require('mongoose');

module.exports = function(di) {
  var db;
  di.inject(function(config) {
    db = mongoose.createConnection(
      'localhost',
      config.db.db);

    di.register('User', db.model('users', require('./User.js')));
    di.register('Project', db.model('projects', require('./Project.js')));
    di.register('Release', db.model('releases', require('./Release.js')));
    di.register('DownloadHistory', db.model('downloadHistory',
      require('./DownloadHistory')));
  });

  return db;
};
