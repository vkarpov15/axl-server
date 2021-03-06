var status = require('http-status');

exports.my = function(Project) {
  return function(req, res) {
    Project.
      find({ 'data.maintainers.username': req.user.username }).
      exec(function(error, projects) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error });
        }

        res.json({ projects: projects });
      });
  }
};

exports.get = function(Project, Release) {
  return function(req, res) {
    var name = (req.query.project || '').toString();
    Project.findOne({ name: name }, function(error, project) {
      if (error) {
        return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({ error: error });
      }
      if (!project) {
        var error = 'Project' + name + ' not found';
        return res.status(status.NOT_FOUND).json({ error: error });
      }

      Release.
        find({ project: name }).
        sort({ releaseNumber: -1 }).
        limit(5).
        exec(function(error, releases) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error });
          }

          return res.json({ project: project, releases: releases });
        });
    });
  };
};

exports.create = function(Project) {
  return function(req, res) {
    var project = new Project(req.body);
    project.save(function(error, project) {
      if (error) {
        return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({ error: error });
      }

      return res.json({ project: project });
    });
  };
};

exports.modify = function(Project) {
  return function(req, res) {
    var name = (req.query.project || '').toString();
    Project.findOneAndUpdate(
      { name: name, 'data.maintainers': req.user.username },
      { $set: { data: req.body.data } },
      { new: true, upsert: false },
      function(error, project) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error });
        }
        if (!project) {
          return res.status(status.NOT_FOUND).json({ error: error });
        }

        return res.json({ project: project });
      });
  };
};

exports.search = function(Project) {
  return function(req, res) {
    var search = (req.query.q || '').toString();

    Project.
      find(
        { $text : { $search : search } },
        { score : { $meta: "textScore" } }).
      sort({ score: { $meta : "textScore" } }).
      limit(10).
      exec(function(error, projects) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error });
        }

        return res.json({ projects: projects });
      });
  };
};