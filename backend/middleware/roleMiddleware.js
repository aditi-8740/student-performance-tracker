const authorizeTeacher = (req,res,next)=>{
    if(req.user.role !=='teacher'){
        return res.status(403).json({message: "Only teacher allowed"});
    }
    next();
}

const authorizeStudent = (req,res,next)=>{
    if(req.user.role !== 'student'){
        return res.status(403).json({message: "Only student allowed"});
    }
    next();
}

module.exports = {
    authorizeTeacher,
    authorizeStudent
};