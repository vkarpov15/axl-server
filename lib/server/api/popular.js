var moment = require('moment');
var status = require('http-status');

exports.month = function(DownloadHistory) {
  return function(req, res) {
    var now = moment();
    DownloadHistory.
      find({ year: now.year(), month: now.month() }, { project: 1, data: 1 }).
      sort({ 'data.downloads': -1 }).
      limit(5).
      exec(function(error, projects) {
        if (error) {
          return res.status(status.INTERNAL_SERVER_ERROR).json({ projects: projects });
        }

        return res.json({ projects: projects });
      });
  };
};