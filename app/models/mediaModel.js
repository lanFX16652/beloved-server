const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    filename: {
        type: String
    },
    mimetype: {
        type: String
    },
    name: {
        type: String
    }
});

module.exports = mongoose.model("media", mediaSchema);