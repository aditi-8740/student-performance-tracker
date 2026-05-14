const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeStudent, authorizeTeacher } = require('../middleware/roleMiddleware');
const { getStudentPerformance } = require('../controllers/userController');

/**
 * @resource Users
 * @base /api/users
*/

/* 
@route GET /api/users/performance
@desc Get student performance
@access Private (Student Only)
*/   //Get all submissions
router.get('/performance', protect, authorizeStudent, getStudentPerformance);

module.exports = router;