const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
    assignmentId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    studentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answer:{
        type: String,  // text answer
        required: true
    },
    marks:{
        type:Number,
        default: null
    }
},{ timestamps: true })


module.exports = mongoose.model('Submission',submissionSchema);