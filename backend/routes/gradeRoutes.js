const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeTeacher } = require("../middleware/roleMiddleware");
const { gradeAssignment } = require("../controllers/gradeController");

router.post("/grade-assignment", protect, authorizeTeacher, gradeAssignment);

module.exports = router;
