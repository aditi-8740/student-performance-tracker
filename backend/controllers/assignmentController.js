const Assignment = require('../models/Assignment');
const Class = require('../models/Class');
const Submission = require('../models/Submission');

const createAssignment = async (req, res)=>{
    try{
    const {title, description, dueDate , classId} = req.body;
    const classData = await Class.findById(classId);
    if(!classData){
        return res.status(404).json({message:"class not found"});
    }
    
    if(classData.teacher.toString() !==req.user._id.toString()){
        return res.status(403).json({message:"Not your class"});
    }

    const createdAssignment = await Assignment.create({
        title,
        description,
        dueDate,
        teacher: req.user._id,
        class: classId
    })

    return res.status(201).json(createdAssignment);

    }catch(error){
        return res.status(500).json({message:"assignment creation unsuccessful"});
    }
}

const submitAssignment = async (req, res) => {
    try {
        const {assignmentId , answer} = req.body;

        const assignmentToSubmit = await Assignment.findById(assignmentId);
        //check assignment exists
        if (!assignmentToSubmit) {
            return res.status(404).json({message: "Assignment not found"});
        }

        const classData = await Class.findById(assignmentToSubmit.class);
        //check class exists
        if(!classData){
            return res.status(404).json({message: "Class Not found"});
        }
        
        //check if student belongs to this class
        const isBelong = req.user.classes.some((classId)=>{
            return classId.toString() === classData._id.toString() 
        })
        if(!isBelong){
            return res.status(403).json({message : "student not in this class"});
        }

        //if student already submitted once
        const alreadySubmitted = await Submission.findOne({
            assignmentId,
            studentId : req.user._id
        });
        
        if( alreadySubmitted ){
            return res.status(409).json({ message: "Already submitted" });
        }
        const submissionCreated = await Submission.create({
            assignmentId,
            studentId : req.user._id,
            answer
        })

        res.status(201).json(submissionCreated);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createAssignment,
    submitAssignment
}