const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeStudent, authorizeTeacher } = require('../middleware/roleMiddleware');
const { getStudentPerformance , getClassPerformance } = require('../controllers/performanceController');

//Get all submissions
router.get('/student-performance', protect, authorizeStudent, getStudentPerformance)

router.get('/class-performance/:classId', protect , authorizeTeacher , getClassPerformance )
module.exports = router;