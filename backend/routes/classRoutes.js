import express from 'express';
const router = express.Router();
import { authorizeTeacher, authorizeStudent } from '../middleware/roleMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import {
    createClass,
    joinClass,
    getClasses,
    getClassDetails,
    getClassAssignmentDetails,
    getClassPerformance
} from '../controllers/classController.js';

/**
 * @resource Classes
 * @base /api/classes
*/

/* 
@route GET /api/classes
@desc Get all classes details for the authenticated user (Teacher sees owned, Student sees enrolled)
@access Private (Teacher, Student)
*/
router.get('/', protect, getClasses);

/* 
@route POST /api/classes
@desc Create a class
@access Private (Teacher Only)
*/
router.post('/', protect, authorizeTeacher, createClass);

/* 
@route POST /api/classes/enroll
@desc join a class
@access Private (Student Only)
*/
router.post('/enroll', protect, authorizeStudent, joinClass);

/* 
@route GET /api/classes/:id
@desc Get detailed information for a specific class
@access Private (Teacher, Student)
*/
router.get('/:classId', protect, getClassDetails);

/* 
@route GET /api/classes/:classId/assignments
@desc get all assignments for a specific class
@access Private (Teacher, Student)
*/
router.get('/:classId/assignments', protect, getClassAssignmentDetails);

/* 
@route GET /api/classes/performance
@desc Get class performance
@access Private (Teacher Only)
*/
router.get('/:classId/performance', protect , authorizeTeacher , getClassPerformance )

export default router;