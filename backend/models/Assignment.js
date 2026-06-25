import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required : true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    dueDate: {
        type: Date,
    },
    marks: {
        type: Number,
        default: null,
    }
})

export default mongoose.model('Assignment', assignmentSchema);
