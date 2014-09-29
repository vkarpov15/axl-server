var mongoose = require('mongoose');

module.exports = function(di) {
  var db = mongoose.createConnection(
    'localhost',
    'axl');

  di.register('User', db.model('users', require('./User.js')));
  di.register('Project', db.model('projects', require('./Project.js')));
  di.register('Release', db.model('releases', require('./Release.js')));
  di.register('DownloadHistory', db.model('downloadHistory',
  	require('./DownloadHistory')));

  return db;
};
