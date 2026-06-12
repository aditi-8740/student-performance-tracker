import Submission from '../models/Submission.js';
import Class from '../models/Class.js';
import User from '../models/User.js';

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

export {
    getStudentPerformance,
}
