import mongoose from 'mongoose';

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
    },
    status: {
        type: String,
        enum:["submitted","graded"],
        default: "submitted"
    }
},{ timestamps: true })


export default mongoose.model('Submission',submissionSchema);