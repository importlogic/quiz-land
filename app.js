// express
const express = require("express");
const app = express();

// json inputs 
app.use(express.json());

// static files 
app.use(express.static('public'))

// env file 
require("dotenv").config();

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`working on port ${PORT}`);
})