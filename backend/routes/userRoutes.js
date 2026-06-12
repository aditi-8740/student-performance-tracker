import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import { authorizeStudent, authorizeTeacher } from '../middleware/roleMiddleware.js';
import { getStudentPerformance } from '../controllers/userController.js';

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

export default router;