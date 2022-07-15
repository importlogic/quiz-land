const router = require('express').Router();

const mongoose = require("mongoose");

const User = require("../models/user.js");

const passport = require("passport");
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/admin/loginSuccess",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  (accessToken, refreshToken, profile, done) => {
    const userData = profile._json;
    User.findOne({googleID: userData.sub}).then((user) => {
        if(user){
            done(null, user);
        }
        else{
            new User({
                googleID: userData.sub,
                firstName: userData.given_name,
                lastName: userData.family_name,
                profilePicture: userData.picture
            }).save().then((user) => {
                done(null, user);
            });
        }
    });
  }
));

function isAuthenticated(req, res, next){
    if(req.user){
        next();
    }
    else{
        res.redirect("/admin/login");
    }
}

router.get("/admin/login", (req, res) => {
    res.render("./admin/login.ejs")
})

router.get("/admin/login/googleAuth", passport.authenticate('google', { 
    scope: ['profile'],
    prompt: "select_account" 
}));

router.get("/admin/loginSuccess", passport.authenticate("google"), (req, res) => {
    res.redirect("/admin/dashboard");
});

router.get("/admin/dashboard", isAuthenticated, (req, res) => {
    res.render("./admin/dashboard.ejs");
})

router.get("/admin/logout", (req, res) => {
    req.logout();
    req.session = null;
    res.send(req.user);
})

module.exports = router;