var jade = require('jade');
var _ = require('underscore');
var commander = require('commander');

module.exports = function(config, fs, nodePackage) {
  var dir = './lib/client/views';
  var files = fs.readdirSync(dir);

  var locals = {
    getJSPath: function(path) {
      if (config.js.local) {
        return '/javascript' + path;
      } else {
        return '//' + config.cloudfront.name + '.cloudfront.net/assets/' +
          nodePackage.version + '/javascript' + path;
      }
    },
    getTemplateBasePath: function(path) {
      if (config.js.local) {
        return '';
      } else {
        return '//' + config.cloudfront.name + '.cloudfront.net/assets/' +
          nodePackage.version;
      }
    },
    config: config.angular
  };

  _.each(files, function(path) {
    if (!/\.jade$/i.test(path)) {
      return;
    }

    var output = './bin/templates/' + path.replace('.jade', '.html');
    var j = jade.compile(fs.readFileSync(dir + '/' + path),
      { filename: dir + '/' + path });
    fs.writeFileSync(output, j(locals));
    console.log('Wrote> ' + path);
  });
};

var omni = require('omni-di');
omni.addInjectToFunctionPrototype(di);
var di = omni();
var config = require('../../server/config.js');
config.loadConfig();
di.register('config', config);
require('../../server/dependencies')(di);
module.exports.inject(di);
