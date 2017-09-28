const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const app = express();

const port = 3000;


app.use(session({secret: 'some-random-string'}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: 'jamescott.auth0.com',
    clientID: '4kdnr1eAa3d3GECQPGFPgrXH7tzjHn22',
    clientSecret: '6Oc144_tWw9SpmQaA58Ll8u9Z2Yt7U3YJ8XI3-nWgRkf5l4lgAQymJ0RqSiWifNH',
    callbackURL: 'http://localhost:3000/auth/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }));

  //fired once per session, established user on session and gives us its values
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  //gives us access to manipulate those values, fired on every request, puts user on the req
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

app.get('/auth', passport.authenticate('auth0'));



//triggered after autho sends back data
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: '/me'
}), (req, res,next) => res.status(200).json(req.user));


//gets user on the view by deserializeUser
app.get('/me', (req, res, next)=> res.json(req.user));



app.listen(port, () => {
  console.log(`Listening on Port: ${port}`);
});