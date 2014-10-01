var api = require('lib/server/api');
var express = require('express');
var omni = require('omni-di');
var assert = require('assert');
var request = require('request');
var _ = require('underscore');
var fs = require('fs');
var yaml = require('js-yaml');
var status = require('http-status');
var fs = require('fs');

var di = omni();
omni.addInjectToFunctionPrototype(di);

di.register('config', _.extend(require('lib/server/config.js'),
  yaml.safeLoad(fs.readFileSync('./axl.config.yml'))));

require('lib/server/dependencies')(di);

describe('Search API', function() {
  var app;
  var server;
  var Project = di.get('Project');

  var authStub = {
    checkLogin: function() {
      return function(req, res, next) {
        throw 'Stubbed out auth';
      };
    }
  };

  beforeEach(function(done) {
    app = express();
    app.use('/api', api(di, authStub));
    server = app.listen(3000);
    Project.remove({}, function() {
      done();
    });
  });

  afterEach(function(done) {
    server.close();
    done();
  });

  it('should be able to get search results', function(done) {
    Project.create(
      { name: 'test' },
      { name: 'mocha', data: { keywords: ['testing'] } },
      { name: 'semver' },
      function(error) {
        assert.ifError(error);
        var url = 'http://localhost:3000/api/search?q=test';
        request(url, function(e, r, body) {
          var obj = JSON.parse(body);
          assert.equal(status.OK, r.statusCode);
          assert.equal(2, obj.projects.length);

          assert.ok(obj.projects[0].name === 'mocha' ||
            obj.projects[1].name === 'mocha');
          assert.ok(obj.projects[0].name === 'test' ||
            obj.projects[1].name === 'test');

          done();
        });
      });
  });
});