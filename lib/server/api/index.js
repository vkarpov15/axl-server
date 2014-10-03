var express = require('express');

var release = require('./release');
var project = require('./project');
var user = require('./user');
var popular = require('./popular');

module.exports = function(di, auth) {
  var router = express.Router();

  router.get('/release', release.get.inject(di));
  router.post('/release',
    auth.checkLogin.inject(di), release.create.inject(di));

  router.get('/project', project.get.inject(di));
  router.post('/project',
    auth.checkLogin.inject(di), project.create.inject(di));
  router.put('/project',
    auth.checkLogin.inject(di), project.modify.inject(di));

  router.get('/search', project.search.inject(di));

  router.get('/me', user.current.inject(di));
  router.get('/me/projects',
    auth.checkLogin.inject(di), project.my.inject(di));

  router.get('/popular/month', popular.month.inject(di));

  return router;
};