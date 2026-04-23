const Submissions = require("../models/Submission");

const getSubmissions = async(req,res)=>{
    const assignmentId = req.params.assignmentId;
    const submissions = await Submissions.find({assignmentId})
    .populate("studentId") ;
    res.json(submissions);
}

module.exports = {
    getSubmissions
};