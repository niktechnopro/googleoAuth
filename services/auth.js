console.log('loading auth module')
const express = require('express');
const passport = require('passport');
const keys = require('../config/keys');
const GoogleStrategy = require('passport-google-oauth20').Strategy;//strategy is just a plugin for passport
const session = require('express-session');
var cookieParser = require('cookie-parser');
const Users = require('../models/users');
const app = express();
const setupAuth = (app) => {
    app.use(cookieParser());//this is cookie middleware
    app.use(session({ //setup session middleware
        secret: 'supersecret password',
        resave: true,
        saveUninitialized: true
    }))
    
    passport.use(new GoogleStrategy({//using google oauth strategy
        clientID : keys.googleClientID,
        clientSecret : keys.googleClientSecret,
        callbackURL : '/auth/google/callback' //route where user will be sent after they grant permission to our application
        }, (accessToken, refreshToken, profile, done) => {
            // console.log('access token ',accessToken)
            // console.log('profile ', profile)
            Users.findOrCreate({where: {googleid: profile.id},
            //if using findOrCreate-returns array
                defaults: {
                    email: profile.emails[0].value,
                    password: profile.id,
                    name: profile.displayName
                }
            }).then(user => {//if insert is succesfull
                    done(null, user)//this crap is going to be plugged in into cookie
            }).catch(error => console.log('error on insertion ',error))
            }
        )
    );
    // method to serialize user for storage
    passport.serializeUser(function(user, done) {
        console.log('user id in passport serialize',user[0].id)   
        done(null, user[0].id);
    });

    // method to de-serialize back for auth - extracting user model back from the cookie
    passport.deserializeUser(function(id, done) {
        console.log('deserialize', id)//this actually comes from datatable
        done(null, id);
    });
    
    //initialize passport middleware and register it with express
    app.use(passport.initialize());
    // start passport's session managemnet middleware and register it with express
    app.use(passport.session())
    
    app.get('/google', passport.authenticate('google', {
        scope: ['profile', 'email']//scope controls how much info you wanna get from google
    }))

    app.get('/logout', (req, res, next)=>{
        req.logout(); //clears the cookie-req.user is destroyed by passport
        // req.user - if succesful logout - will be undefined
        res.redirect('/');
    })
    //auth routes
    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/' }),//it's better to redirect
        (req, res) => {//we have an access to user everywhere
            //now we have to redirect user to diff route, otherwise route is going to show all that crap auth/google/callback etc
        let username = req.user[0].name
        res.redirect(`/success/${username}`);//sending through params
        }
    );
};

//method for checking for a user
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    //denied redirect to login
    res.redirect('/')
}

module.exports = setupAuth;
module.exports.ensureAuthenticated = ensureAuthenticated;