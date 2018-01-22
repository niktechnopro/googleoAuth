//inside here we'll put all passport configuration
const passport = require('passport');
const keys = require('../config/keys');
// startegy is something that helps you to authenticate with one very specific provider
const GoogleStrategy = require('passport-google-oauth20').Strategy;//it exports several properties but we only care about strategy
const Users = require('../models/users');//loading table model
passport.use(new GoogleStrategy({//using google oauth strategy
    clientID : keys.googleClientID,
    clientSecret : keys.googleClientSecret,
    callbackURL : '/auth/google/callback' //route where user will be sent after they grant permission to our application
    }, (accessToken, refreshToken, profile, done) => {
        console.log('accesstoken', accessToken);
        // console.log(profile)
        console.log('google profile id from access token ', profile.id);
        console.log('email from profile ', profile.emails[0].value);
        console.log('name from profile ', profile.displayName);
        console.log('type of profile.id', typeof(profile.id))
        Users.create({
            email: profile.emails[0].value,
            password: 'something',
            name: profile.displayName,
            googleid: profile.id
        })
            .then(user => {
                // console.log(user)
                // done() is passport is similar to next in express - it takes 2 arguments error and result, if we not using error - we can use null instead
                done(null, user)
            })
            .catch(error => console.log('error on insertion ',error))
        }
    )
);