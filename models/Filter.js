const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FilterSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    className: {
        type: String,
        default: "bg__other"
        },
    type: {
        type: String,
        default: 'user_filter'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

// this middleware runs before implementing .save() and sets field userId
// FilterSchema.pre('save', function(next){
//     this.userId == null ? this.userId = 'default_filters' : this.userId
// })

// FilterSchema.virtual('className')
//     .get(function() {
//                 if(this.name === 'work' ||
//                    this.name === 'home' ||
//                    this.name === 'hobby' ||
//                    this.name ===  'other' ||
//                    this.name === 'done'){
//                     return `bt__${this.name}`
//                 }
//                 return 'bg__other';
//             }
//     );


module.exports = mongoose.model('Filter', FilterSchema);