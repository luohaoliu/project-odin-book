const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const bcrypt = require("bcryptjs");
const FacebookStrategy = require('passport-facebook').Strategy;
const request = require('request');
const fs = require('fs');
var path = require('path');


const User = require("./models/user");


passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {

          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

var cookieExtractor = req => {
  var token = null;
  if (req && req.cookies) {
      token = req.cookies['token'];
  }
  return token;
};

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.SECRET,
      jwtFromRequest: cookieExtractor,
    }, (payload, done) => {
    User.findOne({username: payload.username}, (err, user) => {

      if (err) {
          return done(err, false);
      }
      if (user) {
          return done(null, user);
      } else {
          return done(null, false);
      }
  });
  })
);


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  profileFields: ["first_name", "last_name", "picture.type(large)"],
},
(accessToken, refreshToken, profile, done) => {

  User.findOne({facebookId: profile.id}).exec((err, res) => {
    if (err) {
      console.log("facebook login threw an error");
      return done(err, false);
    }
    if (!res) {
      console.log("Importing facebook details.");
      var requestSettings = {
        method: 'GET',
        url: profile.photos[0].value,
        encoding: null,
      }
      request(requestSettings, (error, response, body) => {
        console.log("response: ", response);

        var user = new User({
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          username: "",
          password: "",
          status: "user",
          friends: [],
          friend_requests: [],
          picture: profile.id + ".jpg",
          image: {
            data: body,
            contentType: response.headers[content-type]
          },
          facebookId: profile.id
        });
        console.log("user: ", user);
        user.save( err => {
          if (err) {
            return next(err);
          }
          done(null, user);
        });
      })
    } else {
      console.log("Found the facebook user. Logging in now.");
      var user = res;
      done(null, user);
    }
  });



}
));