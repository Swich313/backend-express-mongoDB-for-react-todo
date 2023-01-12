const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FilterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    className: {
        type: String,
        set: v => `bg__${v}`
    }
});

module.exports = mongoose.model('Filter', FilterSchema);