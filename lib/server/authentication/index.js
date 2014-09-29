var TwitterStrategy = require('passport-twitter').Strategy;
var status = require('http-status');

exports.setupPassport = function(User, config) {
  var passport = require('passport');

  var passportHandler = function(token, tokenSecret, profile, done) {
    if (!profile || !profile.id || !profile.username) {
      return done("Profile invalid, required id and username: " +
        JSON.stringify(profile), null);
    }

    User.findOneAndUpdate(
      { _id: profile.id },
      { $set: { username : profile.username } },
      { upsert: true, new: true },
      function(error, result) {
        done(error, result);
      });
  };

  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.key,
    consumerSecret: config.twitter.secret,
    callbackURL: config.twitter.callback
  },
  passportHandler));

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(
    function(id, done) {
      User.findOne({ _id : id }, function(error, user) {
        done(error, user);
      });
    });
};

exports.checkLogin = function() {
  return function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(status.UNAUTHORIZED).json({ redirect : '/auth/twitter' });
    }
  };
};

exports.logout = function() {
  return function(req, res) {
    req.logout();
    res.redirect('/');
  };
};