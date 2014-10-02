var gulp = require('gulp');
var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var status = require('http-status');
var spawn = require('child_process').spawn;
var omni = require('omni-di');
omni.addInjectToFunctionPrototype(di);
var di = omni();
var config = require('./lib/server/config.js');
config.loadConfig();
di.register('config', config);
require('./lib/server/dependencies')(di);

gulp.task('minifyJS', function() {
  return gulp.
    src('./bin/javascript/ui.js').
    pipe(require('gulp-uglify')({ mangle: false })).
    pipe(gulp.dest('./bin/javascript'));
});

gulp.task('export', ['minifyJS'], function(PipeToS3) {
  return function(cb) {
    PipeToS3.setBase('/assets/' + require('./package.json').version);

    var functionsToRun = [];
    functionsToRun.push(function(callback) {
      console.log('a');
      fs.stat('./bin/javascript/ui.js', function(error, stat) {
        console.log('b');
        if (error) {
          return callback(error);
        }

        var stream = fs.createReadStream('./bin/javascript/ui.js');
        var s3Stream = PipeToS3('/javascript/ui.js', stat.size);
        stream.pipe(s3Stream);

        s3Stream.on('response', function(ret) {
          if (ret.statusCode === status.OK) {
            return callback();
          }
          callback(ret.statusCode);
        });
      });
    });

    var templates = fs.readdirSync('./bin/templates');
    _.each(templates, function(template) {
      if (!/\.html$/.test(template)) {
        return;
      }

      functionsToRun.push(function(callback) {
        console.log('template - ' + template);
        fs.stat('./bin/templates/' + template, function(error, stat) {
          console.log(template + ' done');

          if (error) {
            return callback(error);
          }

          console.log(template);
          var stream = fs.createReadStream('./bin/templates/' + template);
          console.log('Created read stream for ' + template);

          var s3Stream = PipeToS3('/templates/' + template, stat.size);
          stream.pipe(s3Stream);
          console.log('Piped for ' + template);
          s3Stream.on('response', function(ret) {
            if (ret.statusCode === status.OK) {
              return callback();
            }
            callback(ret.statusCode);
          });
        });
      });
    });

    async.parallel(functionsToRun, function(error) {
      if (error) {
        return cb(error);
      }
      cb(null);
    });
  };
}.inject(di));

