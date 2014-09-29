module.exports = {
  s3: {
    bucket: '',
    key: '',
    secret: ''
  },
  cloudfront: {
    name: ''
  },
  js: {
  	local: true
  },
  templates: {
    local: true
  },
  port: 3000,
  twitter: {
    key: '',
    secret: '',
    callback: ''
  }
};

var commander = require('commander');
var _ = require('underscore');
var yaml = require('js-yaml');
var fs = require('fs');
module.exports.loadConfig = function() {
  var configPath = commander.config || process.env.CONFIG || './axl.config.yml';
  var config = _.extend(module.exports,
    yaml.safeLoad(fs.readFileSync(configPath)));
};