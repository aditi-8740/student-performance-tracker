import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import Submission from "../models/Submission.js";

const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, classId, marks } = req.body;
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
      marks,
    });

    return res.status(201).json(createdAssignment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "assignment creation unsuccessful" });
  }
};

const getAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;

    const assignmentData = await Assignment.findById(assignmentId);

    return res.status(200).json(assignmentData);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

const getSubmissions = async (req, res) => {
  const assignmentId = req.params.assignmentId;
  const submissions = await Submission.find({ assignmentId }).populate(
    "studentId",
    "name",
  );

  res.json(submissions);
};

const gradeAssignment = async (req, res) => {
  try {
    const { marks } = req.body;
    const { submissionId } = req.params;
    const numericMarks = Number(marks);

    // 1. find submission
    const SubmissionData = await Submission.findById(submissionId);
    if (!SubmissionData) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // 2. find assignment
    const assignmentData = await Assignment.findById(
      SubmissionData.assignmentId,
    );
    if (!assignmentData) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // 3. find class
    const classData = await Class.findById(assignmentData.class);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // 4. Check teacher owns class
    if (classData.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your class" });
    }

    // Basic Marks validation
    if (Number.isNaN(numericMarks) || numericMarks < 0) {
      return res
        .status(400)
        .json({ message: "Marks must be a valid non-negative number" });
    }

    if (assignmentData.marks != null && numericMarks > assignmentData.marks) {
      return res.status(400).json({
        message: `Marks must be between 0 and ${assignmentData.marks}`,
      });
    }

    // 5. Update marks
    SubmissionData.marks = numericMarks;
    SubmissionData.status = "graded";
    await SubmissionData.save();

    res.json({ message: "Graded successfully", SubmissionData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAssignmentPerformance = async (req, res) => {
  const assignmentId = req.params.assignmentId;
  // 1. find assignment
  const assignmentData = await Assignment.findById(assignmentId);

  if (!assignmentData) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  // 2. find class
  const classData = await Class.findById(assignmentData.class).populate("students", "name");
  if (!classData) {
    return res.status(404).json({ message: "Class not found" });
  }

  // 3. Check teacher owns class
  if (classData.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not your class" });
  }

  // 4. get all Submissions of this assignment
  const submissions = await Submission.find({ assignmentId: assignmentId });

  // 5. lookup map (studentId -> submission)
  const submissionMap = new Map();
  submissions.forEach((s) => {
    submissionMap.set(s.studentId.toString(), s);
  });

  //6. loop over students to get all students performance data
  const studentPerformanceList = classData.students.map((student)=>{
    const sub = submissionMap.get(student._id.toString());

    if(!sub){
      return {
        studentId: student._id,
        name: student.name,
        status: "Not submitted",
        marks: null,
        submittedAt:  null
      }
    }
    return {
      studentId: student._id,
      name: student.name,
      status: sub.status,
      marks: sub.marks,
      submittedAt: sub.createdAt
    }
  })
  
  //calculate average marks of this assignment
  const totalSum = submissions.reduce((acc, sub)=>{
    if(sub.marks != null){
      acc += sub.marks;
      return acc;
    }
    return acc;
  },0);
  const avgMarks = submissions.length > 0 ? totalSum / submissions.length : null;

  //calculate highest marks of this assignment
  const highestMarks = submissions.reduce((max, sub)=>{
    if(sub.marks != null && (max== null || sub.marks > max)){
      return sub.marks;
    } 
    return max;
  }, null);

  //calculate lowest marks of this assignment
  const lowestMarks = submissions.reduce((min, sub)=>{
    if(sub.marks != null && (min === null || sub.marks < min)){
      return sub.marks;
    }
    return min;
  }, null);

  res.json({
    assignmentId: assignmentData._id,
    title: assignmentData.title,
    averageMarks: avgMarks,
    highestMarks: highestMarks,
    lowestMarks: lowestMarks,
    totalSubmissions: submissions.length,
    students: studentPerformanceList
  });
};

export {
  createAssignment,
  submitAssignment,
  getSubmissions,
  gradeAssignment,
  getAssignment,
  getAssignmentPerformance,
};
