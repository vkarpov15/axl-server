var express = require('express');
var omni = require('omni-di');

var di = omni();
omni.addInjectToFunctionPrototype(di);

var config = require('./config.js');
config.loadConfig();
di.register('config', config);

var app = express();
app.use(require('cookie-parser')());
app.use(require('express-session')({
  secret: "This is a secret",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

require('./dependencies.js')(di);
var auth = require('./authentication');
auth.setupPassport.inject(di);

// Entry point into single page app
app.get('/', function(fs) {
  return function(req, res) {
    var stream = fs.createReadStream('./bin/templates/layout.html');
    stream.pipe(res);
  };
}.inject(di));

// Authentication
app.get('/logout', auth.logout.inject(di));
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/return', passport.authenticate('twitter',
  { successRedirect: '/', failureRedirect: '/login' }));

// REST-ish API
app.use('/api', require('./api')(di, auth));

// If dev, be able to get templates locally
di.inject(function(config) {
  if (config.js.local || config.templates.local) {
    app.use(express.static('./bin'));
  }
});

app.listen(config.port);
console.log('Listening on port ' + config.port);
