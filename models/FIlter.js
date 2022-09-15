const mongoose = require('mongoose');
const {Schema} = mongoose;

const FilterSchema = new Schema({
    id: String,
    name: String,
    className: String
});

module.exports = mongoose.model('Filters', FilterSchema);

