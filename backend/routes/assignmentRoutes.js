const express = require('express');
const router = express.Router();
const {authorizeTeacher, authorizeStudent} = require('../middleware/roleMiddleware');
const {protect} = require('../middleware/authMiddleware');
const {createAssignment, submitAssignment, getAssignmentDetails} = require('../controllers/assignmentController')

//CREATE ASSIGNMENT(by teacher only)
router.post('/create-assignment', protect, authorizeTeacher , createAssignment);

//SUBMIT ASSIGNMENT(by student only)
router.post('/submit-assignment', protect, authorizeStudent , submitAssignment);

//assignment details
router.get('/assignments/:classId' , protect, getAssignmentDetails );

module.exports = router;