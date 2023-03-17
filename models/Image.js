const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;

const ImageSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Image', ImageSchema);