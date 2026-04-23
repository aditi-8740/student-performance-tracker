const Class = require('../models/Class');
const User = require('../models/User');

const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8);
};

const createClass = async (req, res)=>{
    try{
    const {title, subject} = req.body;

    let joinCode;
    let exists;
    //generate unique join code
    do {
        joinCode =generateJoinCode();
        exists = await Class.findOne({joinCode})
    } while (exists);
    
    // Create class in DB
    const createdClass = await Class.create({
        title: title,
        subject : subject,
        teacher : req.user._id,
        students : [],
        joinCode : joinCode
    })

    //update teacher classes
    await User.findByIdAndUpdate(
        req.user._id,
        { $push: { classes: createdClass._id}}
    );

    res.status(201).json(createdClass);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const joinClass = async (req,res) =>{
    try {
        const { joinCode } = req.body;

        const joinedClass = await Class.findOne({joinCode});
        if(!joinedClass){    //if joined class not found or not a valid join code
            return res.status(404).json({message: "class not found"});
        }

        //if student already joined
        const isAlreadyJoined = joinedClass.students.some(
            (id) => id.toString() === req.user._id.toString()
        );

        if(isAlreadyJoined){
            return res.status(409).json({message:"Already joined"});
        }     

        await Class.findByIdAndUpdate(
            joinedClass._id,
            { $push: { students: req.user._id}}
        );

        await User.findByIdAndUpdate(
            req.user._id,
            {$push: {classes: joinedClass._id}}
        );
        const updatedClass = await Class.findById(joinedClass._id)
        res.json({message: "Joined successfully", updatedClass});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getMyClasses = async (req, res) => {
  try {
    let classes;

    if (req.user.role === "teacher") {
      classes = await Class.find({ teacher: req.user._id });
    } else {
      classes = await Class.find({ students: req.user._id });
    }

    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClassDetails = async (req, res) => {
    const cls = await Class.findById(req.params.id);
    res.json(cls);
}

module.exports = {
    createClass,
    joinClass,
    getMyClasses,
    getClassDetails
};