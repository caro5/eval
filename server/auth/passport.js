var passport = require('passport');
var User = require('../user/userModel');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  // console.log('user is being seriliazed');
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('local-login', new LocalStrategy({
  usernameField: "email",
}, function(email, password, done) {
  User.findOne({ email: email}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Unknown user ' + email });
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        console.log('error', err);
        return done(err);
      }
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));


passport.use('local-signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    var tempUser = req.body;
    User.create(tempUser, function(err, createdUser) {
      if (!err) {
        done(null, createdUser);
      }
    });
  }
));


module.exports = passport;