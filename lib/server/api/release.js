var semver = require('semver');
var status = require('http-status');
var fs = require('fs');
var moment = require('moment');
var _ = require('underscore');

exports.get = function(Release, Project, DownloadHistory) {
  return function(req, res) {
    var project = req.query.project.toString();
    var version = req.query.version.toString();

    var stream = Release.
      find({ project: project }).
      sort({ releaseNumber: -1 }).
      stream();

    var found = false;
    stream.on('data', function(release) {
      if (semver.satisfies(release.version, version)) {
        var now = moment();

        Project.update(
          { name: project },
          { $inc: { downloadsCount: 1 } },
          function(err) {});
        DownloadHistory.update(
          { project: project, year: now.year(), month: now.month() },
          { $inc: { 'data.downloads': 1 } }, function(err) {});

        found = true;
        res.json({ release: release });
        stream.destroy();
      }
    });

    stream.on('error', function(error) {
      res.status(status.INTERNAL_SERVER_ERROR).json({ error: error });
    });

    stream.on('end', function() {
      if (!found) {
        var err = {
          error: 'No releases found matching ' + project + '@' + version
        };
        return res.status(status.NOT_FOUND).json(err);
      }
    });
  };
};

exports.create = function(Release, Project, PipeToS3, config, CloudfrontConverter) {
  return function(req, res) {
    var project = req.query.project.toString();
    var version = req.query.version.toString();

    var release = new Release({ project: project, version: version });

    Project.findOneAndUpdate(
      {
        name: project
      },
      {
        $addToSet: {
          releases: version
        }
      },
      {
        upsert: false,
        'new': false
      },
      function(error, project) {
        if (error) {
          return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error });
        }
        if (!project) {
          var err = 'project ' + project + ' not found';
          return res.status(status.NOT_FOUND).json({ error: err });
        }

        var maintainerUsernames = _.pluck(project.data.maintainers, 'username');
        if (maintainerUsernames.indexOf(req.user.username) === -1) {
          return res.status(status.UNAUTHORIZED).json({ redirect: '/auth/twitter' });
        }

        if (project.releases.indexOf(version) != -1) {
          var err = 'Cant overwrite existing release ' + release.stringify;
          return res.status(status.CONFLICT).json({ error: err });
        }

        var fileName = '/' + release.stringify + '.tgz';
        var size = req.headers['content-length'];
        var s3Pipe = PipeToS3(fileName, size);

        req.pipe(s3Pipe);

        s3Pipe.on('response', function(ret) {
          if (ret.statusCode === status.OK) {
            release.releaseNumber = project.releases.length;
            release.download = CloudfrontConverter(
              'http://s3.amazonaws.com/axl-test/releases/' +
                encodeURIComponent(fileName.substr(1)));
            release.save(function(error) {
              if (error) {
                res.status(status.INTERNAL_SERVER_ERROR);
                return res.json({ error: error });
              }

              return res.json({ release: release });
            });
          } else {
            res.status(ret.statusCode);
            ret.pipe(res);
          }
        });
      });
  };
};