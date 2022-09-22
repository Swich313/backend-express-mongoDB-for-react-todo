const mongoose = require('mongoose');
const {Schema} = mongoose;

const TodoSchema = new Schema({
    title: String,
    description: String,
    deadline: String,
    type: String,
    completed: Boolean,
    archived: Boolean
});

module.exports = mongoose.model('Todos', TodoSchema);