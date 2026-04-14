const express = require('express');
const router = express.Router();
const {authorizeTeacher, authorizeStudent} = require('../middleware/roleMiddleware');
const {protect} = require('../middleware/authMiddleware');
const {createClass, joinClass} = require('../controllers/classController');

//CREATE-CLASS(by teacher only)
router.post('/create-class', protect, authorizeTeacher, createClass );

//JOIN-CLASS(by student only)
router.post('/join-class' , protect, authorizeStudent , joinClass);

module.exports = router;