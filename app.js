require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.set("view engine", "ejs");

const passport = require("passport");
const cookieSession = require("cookie-session");
app.use(cookieSession({
    keys: [process.env.SESSION_SECRET],
    maxAge: 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());

const adminRoute = require("./routes/admin.js");
app.use(adminRoute);

const mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGO_URL}/testing`);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`working on port ${PORT}`);
})