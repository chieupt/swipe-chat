const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model
const User = require('../model/User');

module.exports = (passport)=> {

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      // Match user
      await User.findOne({
        username: username
      }).then(async user => {
        if (!user) {
          return done(null, false, { message: 'Username or password incorrect!' });
        }
        try {
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Password incorrect' })
          }
        } catch (e) {
          return done(e)
        }
      });
      
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
})
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    })
});
};
