const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['teacher','student','admin'],
        default: 'student',
        required: true
    },
    password: {
        type:String,
        required: true
    },
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }]
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);