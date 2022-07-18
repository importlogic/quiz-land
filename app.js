require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "ejs");

const passport = require("passport");
const cookieSession = require("cookie-session");
app.use(cookieSession({
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());

const adminRoute = require("./routes/admin.js");
app.use(adminRoute);
const generalRouter = require("./routes/index.js");
app.use(generalRouter);
const quizRouter = require("./routes/quiz.js");
app.use(quizRouter);
const internalAPI = require("./routes/internalAPI.js");
app.use(internalAPI);

const mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGO_URL}/quizlandDB`);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`working on port ${PORT}`);
})

app.use((req, res, next) => {
    res.status(404).render("broken.ejs", {
        code: "404"
    })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render("broken.ejs", {
        code: "500"
    })
})