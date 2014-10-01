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

describe('REST API', function() {
  describe('releases', function() {
    var app;
    var server;
    var Release = di.get('Release');
    var Project = di.get('Project');
    var user = {
      id: '1234',
      username: 'code_barbarian'
    };

    var authStub = {
      checkLogin: function() {
        return function(req, res, next) {
          req.user = user;
          next();
        };
      }
    }

    beforeEach(function(done) {
      app = express();
      app.use('/api', api(di, authStub));
      server = app.listen(3000);
      Project.remove({}, function() {
        Release.remove({}, function() {
          done();
        });
      });
    });

    afterEach(function(done) {
      server.close();
      done();
    });

    it('should be able to load a version', function(done) {
      Release.create(
        {
          project: 'mongo-sanitize',
          version: '1.0.0',
          releaseNumber: 0,
          download: 'google.com'
        },
        function(error) {
          assert.ifError(error);

          var url = 'http://localhost:3000/api/release?' +
            'project=mongo-sanitize&version=1.0.0';
          request.get(url, function(e, r, body) {
            assert.ifError(e);
            var obj = JSON.parse(body);
            assert.equal('1.0.0', obj.release.version);
            assert.equal('mongo-sanitize', obj.release.project);
            done();
          });
        });
    });

    it('should stream through multiple versions', function(done) {
      Release.create(
        {
          project: 'mongo-sanitize',
          version: '1.0.0',
          releaseNumber: 0,
          download: 'google.com'
        },
        {
          project: 'mongo-sanitize',
          version: '1.0.1',
          releaseNumber: 1,
          download: 'google.com'
        },
        function(error) {
          assert.ifError(error);

          var url = 'http://localhost:3000/api/release?' +
            'project=mongo-sanitize&version=1.0.0';
          request.get(url, function(e, r, body) {
            assert.ifError(e);
            var obj = JSON.parse(body);
            assert.equal('1.0.0', obj.release.version);
            assert.equal('mongo-sanitize', obj.release.project);
            done();
          });
        });
    });

    it('should be able to parse semver', function(done) {
      Release.create(
        {
          project: 'mongo-sanitize',
          version: '1.0.0',
          releaseNumber: 0,
          download: 'google.com'
        },
        {
          project: 'mongo-sanitize',
          version: '1.0.1',
          releaseNumber: 1,
          download: 'google.com'
        },
        {
          project: 'mongo-sanitize',
          version: '1.1.0',
          releaseNumber: 2,
          download: 'google.com'
        },
        function(error) {
          assert.ifError(error);

          var v = encodeURIComponent('~1.0');
          var url = 'http://localhost:3000/api/release?' +
            'project=mongo-sanitize&version=' + v;
          request.get(url, function(e, r, body) {
            assert.ifError(e);
            var obj = JSON.parse(body);
            assert.equal('1.0.1', obj.release.version);
            assert.equal('mongo-sanitize', obj.release.project);
            done();
          });
        });
    });

    it('should be able to upload a tarball', function(done) {
      var project = {
        name: 'mongo-sanitize',
        releases: [],
        data: { maintainers: [{ username: 'code_barbarian' }] }
      };
      Project.create(project, function(error) {
        assert.ifError(error);
        var url = 'http://localhost:3000/api/release?' +
          'project=mongo-sanitize&version=1.0.0';
        var size = fs.statSync('test/integration/api/test.go.tgz').size;
        var writeStream = request.post({ url: url, headers: { 'Content-Length': size } });
        var readStream = fs.createReadStream('test/integration/api/test.go.tgz');
        readStream.pipe(writeStream);
        writeStream.on('response', function(data) {
          Project.findOne({ name: 'mongo-sanitize' }, function(error, project) {
            assert.ifError(error);
            assert.ok(!!project);
            assert.equal(1, project.releases.length);
            Release.findOne({ project: 'mongo-sanitize', version: '1.0.0' }, function(error, release) {
              assert.ifError(error);
              assert.ok(!!release);
              assert.ok(release.download.indexOf('cloudfront') != -1);
            });
            done();
          });
        });
        writeStream.on('error', function(error) {
          assert.ifError(error);
          done();
        });
        readStream.on('error', function(error) {
          assert.ifError(error);
          done();
        });
      });
    });

    it('should fail to create a new release if one already exists', function(done) {
      var project = {
        name: 'mongo-sanitize',
        releases: ['1.0.0'],
        data: { maintainers: [{ username: 'code_barbarian' }] }
      };
      Project.create(project, function(error) {
        assert.ifError(error);
        Release.create(
          {
            project: 'mongo-sanitize',
            version: '1.0.0',
            releaseNumber: 0,
            download: 'google.com'
          },
          function(error) {
            assert.ifError(error);

            var url = 'http://localhost:3000/api/release?' +
              'project=mongo-sanitize&version=1.0.0';
            request.post(url, function(e, r, body) {
              assert.ifError(e);
              var obj = JSON.parse(body);
              assert.equal(status.CONFLICT, r.statusCode);
              assert.equal('Cant overwrite existing release mongo-sanitize@1.0.0', obj.error);
              done();
            });
          });
      });
    });
  });
});