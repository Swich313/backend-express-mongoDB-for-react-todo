const mongoose = require('mongoose');
const {Schema} = mongoose;

const TodoSchema = new Schema({
    id: String,
    title: String,
    description: String,
    deadline: String,
    type: String,
    completed: Boolean,
    archived: Boolean
});

module.exports = mongoose.model('Todos', TodoSchema);