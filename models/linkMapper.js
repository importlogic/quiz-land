const mongoose = require("mongoose");

const linkMapperSchema = new mongoose.Schema({
    hashLink: String,
    quizID: String
});

const LinkMapper = new mongoose.model("LinkMapper", linkMapperSchema);

module.exports = LinkMapper;