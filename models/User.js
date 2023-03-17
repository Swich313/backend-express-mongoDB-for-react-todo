const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        // validate: [isEmail, 'Invalid Email!']
    },
    password: {
        type: String,
        required: true
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    activationLink: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: 'User'
    },
    resetToken: {
        type: String,
        default: ''
    },
    resetTokenExpiration: {
        type: Date,
        default: Date.now
    },
    // imageUrl: {
    //     type: String,
    //     required: true,
    //     default: '1675421569146-837291014-3d DN Ð¿ÐµÑÐµÐ´Ð°ÑÐ° .JPG'
    // },
    todos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
})

module.exports = mongoose.model('User', userSchema);