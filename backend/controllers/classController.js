import Assignment from '../models/Assignment.js';
import Class from '../models/Class.js';
import User from '../models/User.js';
import Submission from '../models/Submission.js';

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
        // get total no. of assignment for this class
        const totalAssignments = await Assignment.find({class: classId}).countDocuments();      

        res.json({
          classId: classData._id,
            classTitle: classData.title,
            classSubject: classData.subject,
            totalStudents: classData.students.length,
            totalAssignments: totalAssignments,
        });
        
    } catch (error) {
        res.status(500).json({message : error.message});
    }

}

const getStudents = async (req,res)=>{
  const {classId} = req.params;
  try {
    const classData = await Class.findById(classId).populate("students","name");
    
    if(!classData){
      res.status(404).json({message: "Class not found"});
    }
    return res.status(200).json(classData.students)
  } catch (error) {
    res.status(500).json({message: error.message});
  }

}

export {
  createClass,
  joinClass,
  getClasses,
  getClassDetails,
  getClassAssignmentDetails,
  getClassPerformance,
  getStudents
};