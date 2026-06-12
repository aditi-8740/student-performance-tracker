import express from 'express';
const router = express.Router();
import { authorizeTeacher, authorizeStudent } from '../middleware/roleMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import {
    createAssignment,
    submitAssignment,
    getSubmissions,
    gradeAssignment
} from '../controllers/assignmentController.js'

/**
 * @resource Assignments
 * @base /api/assignments
 */


/* 
@route POST /api/assignments
@desc Create a new assignment
@access Private (Teacher Only)
*/
router.post('/', protect, authorizeTeacher , createAssignment);

/* 
@route POST /api/assignments/:id/submissions
@desc Submit a assignment
@access Private (Student Only)
*/
router.post('/:assignmentId/submissions', protect, authorizeStudent , submitAssignment);

/* 
@route GET /api/assignments/:id/submissions
@desc Get all Submissions for a specific assignment
@access Private (Teacher Only)
*/
router.get('/:assignmentId/submissions', protect, authorizeTeacher, getSubmissions );

/*
@route PATCH /api/assignments/:id/submissions
@desc Grade a specific assignment
@access Private (Teacher Only)
*/
router.patch("/:assignmentId/submissions/:submissionId", protect, authorizeTeacher, gradeAssignment);

export default router;