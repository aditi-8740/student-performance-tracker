const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeTeacher } = require('../middleware/roleMiddleware');
const { getSubmissions } = require("../controllers/submissionController")

// get all submissions for assignment
router.get('/submissions/:assignmentId', protect, authorizeTeacher, getSubmissions );

module.exports = router;