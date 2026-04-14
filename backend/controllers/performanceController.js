const Submission = require("../models/Submission");
const Class = require("../models/Class");
const User = require("../models/User");

const getStudentPerformance = async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.user._id });

        //only graded
        const graded = submissions.filter((submission)=>{
            if (submission.marks != null) return true;
        })

        if(graded.length === 0){
            return res.json({
                totalAssignments : 0,
                averageMarks: 0,
                highest: 0,
                lowest: 0
            });
        }

        const allMarks = graded.map(sub =>  sub.marks);
        const totalAssignments = allMarks.length;
        const sum = allMarks.reduce((acc, val) => acc+ val, 0 );
        const avg = sum/totalAssignments;
        const highest = Math.max(...allMarks);
        const lowest = Math.min(...allMarks);

        res.json({
            totalAssignments,
            averageMarks: avg,
            highest,
            lowest
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
    getStudentPerformance,
    getClassPerformance
}