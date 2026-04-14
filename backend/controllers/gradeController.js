const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Class = require('../models/Class');

const gradeAssignment = async (req, res) => {
    try {
        const { submissionId, marks } = req.body;

        // 1. find submission
        const SubmissionData = await Submission.findById(submissionId);
        if (!SubmissionData) {
            return res.status(404).json({ message: "Submission not found" });
        }
        
        // 2. find assignment
        const assignmentData = await Assignment.findById(SubmissionData.assignmentId);
        
        // 3. find class
        const classData = await Class.findById(assignmentData.class);
        
        // 4. Check teacher owns class
        if (classData.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not your class" });
        }

        // Basic Marks validation
        if( marks<0 || marks > 100 ){
            return res.status(400).json({ message : "Marks must be between 0-100" });
        }

        // 5. Update marks
        SubmissionData.marks = marks;
        await SubmissionData.save();

        res.json({ message: "Graded successfully", SubmissionData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { gradeAssignment };
