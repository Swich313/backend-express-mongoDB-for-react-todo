const mongoose = require('mongoose');
const {Schema} = mongoose;

const TodoSchema =  new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    todoType: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        default: Date.now,
    },
    completed: {
        type: Boolean,
        default: false
    },
    archived: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Todo', TodoSchema);