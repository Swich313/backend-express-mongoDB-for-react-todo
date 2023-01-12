const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        // unique: true,
        // lowercase: true,
        // validate: [isEmail, 'Invalid Email!']
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
        default: ''
    },
    resetTokenExpiration: {
        type: Date,
        default: Date.now
    },
    todos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
})

module.exports = mongoose.model('User', userSchema);