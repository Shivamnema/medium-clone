var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

/*LocalStrategy usually looks at the username and password field
 of the request body coming from the front-end.
  We're expecting our request body from the front-end 
  will be in the format of:
{
  "user": {
    "email": "jake@example.com".
    "password": "mypasswordisjake"
  }
}

*/


passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, function(email, passport, done) {
    User.findOne({ email: email }).then(function(user) {
        if (!user || !user.validPassword(passport)) {
            return done(null, false, {
                error: {
                    'email or password': 'is invalid'
                }
            });
        }
        return done(null, user);
    }).catch(done)
}));