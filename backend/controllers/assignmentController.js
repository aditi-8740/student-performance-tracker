import Assignment from '../models/Assignment.js';
import Class from '../models/Class.js';
import Submission from '../models/Submission.js';

const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, classId } = req.body;
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "class not found" });
    }

    if (classData.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your class" });
    }

    const createdAssignment = await Assignment.create({
      title,
      description,
      dueDate,
      teacher: req.user._id,
      class: classId,
    });

    return res.status(201).json(createdAssignment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "assignment creation unsuccessful" });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const { answer } = req.body;
    const assignmentId = req.params.assignmentId;

    const assignmentToSubmit = await Assignment.findById(assignmentId);
    //check assignment exists
    if (!assignmentToSubmit) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const classData = await Class.findById(assignmentToSubmit.class);
    //check class exists
    if (!classData) {
      return res.status(404).json({ message: "Class Not found" });
    }

    //check if student belongs to this class
    const isBelong = req.user.classes.some((classId) => {
      return classId.toString() === classData._id.toString();
    });
    if (!isBelong) {
      return res.status(403).json({ message: "student not in this class" });
    }

    //if student already submitted once
    const alreadySubmitted = await Submission.findOne({
      assignmentId,
      studentId: req.user._id,
    });

    if (alreadySubmitted) {
      return res.status(409).json({ message: "Already submitted" });
    }
    const submissionCreated = await Submission.create({
      assignmentId,
      studentId: req.user._id,
      answer,
    });

    res.status(201).json(submissionCreated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubmissions = async(req,res)=>{
    const assignmentId = req.params.assignmentId;
    const submissions = await Submission.find({assignmentId})
    .populate("studentId", "name") ;

    res.json(submissions);
}

const gradeAssignment = async (req, res) => {
    try {
        const { marks } = req.body; 
        const { submissionId } = req.params;

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

export {
  createAssignment,
  submitAssignment,
  getSubmissions,
  gradeAssignment
};
