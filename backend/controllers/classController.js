const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
const User = require("../models/User");
const Submission = require("../models/Submission");

const generateJoinCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

const createClass = async (req, res) => {
  try {
    const { title, subject } = req.body;

    let joinCode;
    let exists;
    //generate unique join code
    do {
      joinCode = generateJoinCode();
      exists = await Class.findOne({ joinCode });
    } while (exists);

    // Create class in DB
    const createdClass = await Class.create({
      title: title,
      subject: subject,
      teacher: req.user._id,
      students: [],
      joinCode: joinCode,
    });

    //update teacher classes
    await User.findByIdAndUpdate(req.user._id, {
      $push: { classes: createdClass._id },
    });

    res.status(201).json(createdClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const joinClass = async (req, res) => {
  try {
    const { joinCode } = req.body;

    const joinedClass = await Class.findOne({ joinCode });
    if (!joinedClass) {
      //if joined class not found or not a valid join code
      return res.status(404).json({ message: "class not found" });
    }

    //if student already joined
    const isAlreadyJoined = joinedClass.students.some(
      (id) => id.toString() === req.user._id.toString(),
    );

    if (isAlreadyJoined) {
      return res.status(409).json({ message: "Already joined" });
    }

    await Class.findByIdAndUpdate(joinedClass._id, {
      $push: { students: req.user._id },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { classes: joinedClass._id },
    });
    const updatedClass = await Class.findById(joinedClass._id);
    res.json({ message: "Joined successfully", updatedClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClasses = async (req, res) => {
  try {
    let classes;

    if (req.user.role === "teacher") {
      classes = await Class.find({
        teacher: req.user._id,
      }).select("_id title subject joinCode");
    } else {
      classes = await Class.find({
        students: req.user._id,
      }).select("_id title subject");
    }

    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClassDetails = async (req, res) => {
  const cls = await Class.findById(req.params.classId);
  res.json(cls);
};

const getClassAssignmentDetails = async (req, res) => {
  const assignments = await Assignment.find({
    class: req.params.classId,
  });

  res.json(assignments);
};

const getClassPerformance = async (req,res)=>{
    try {
        const { classId } = req.params;
        
        // 1. Check class exists
        const classData = await Class.findById(classId);
        if(!classData){
            return res.status(404).json({ message: "Class not found" });
        }
        
        // 2. check teacher owns class
        if( classData.teacher.toString() !== req.user._id.toString() ){
            return res.status(403).json({ message: "Not your class" });
        }
        
        // 3. get all students documents profile data enrolled in this class
        const students = await User.find({
            _id : { $in : classData.students }
        });
        
        // 4. get ALL submissions documents of this class
        const submissions = await Submission.find({
            studentId : { $in: classData.students}
        });

        // 5. map student performance
        const studentPerformance = students.map(student => {
            const studentSubs = submissions.filter(
                sub => sub.studentId.toString() === student._id.toString() && sub.marks !== null
            );

            const marks = studentSubs.map(sub => sub.marks);

            let avg=0;
            if(marks.length > 0){
                const sum = marks.reduce((a,b)=> a+b, 0);
                avg = sum/ marks.length;
            }

            return {
                studentId: student._id,
                name: student.name,
                average: avg
            };
        })

        // 6. class average
        const allMarksArray = submissions
        .filter(sub=> sub.marks != null)
        .map(sub=> sub.marks);

        const classAverage = allMarksArray.length > 0
        ? allMarksArray.reduce((a,b)=> a+b, 0) / allMarksArray.length
        : 0;

        res.json({
            classAverage,
            students: studentPerformance
        });
        
    } catch (error) {
        res.status(500).json({message : error.message});
    }

}

module.exports = {
  createClass,
  joinClass,
  getClasses,
  getClassDetails,
  getClassAssignmentDetails,
  getClassPerformance
};