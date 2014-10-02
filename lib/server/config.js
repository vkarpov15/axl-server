module.exports = {
  s3: {
    bucket: '',
    key: '',
    secret: ''
  },
  cloudfront: {
    name: ''
  },
  db: {
    db: 'axl'
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
  },
  angular: {
    mockBackend: false
  }
};

var _ = require('underscore');
var yaml = require('js-yaml');
var fs = require('fs');
var commander = require('commander');
module.exports.loadConfig = function() {
  var configPath = commander.config || process.env.CONFIG || './axl.config.yml';
  var config = _.extend(module.exports,
    yaml.safeLoad(fs.readFileSync(configPath)));
};