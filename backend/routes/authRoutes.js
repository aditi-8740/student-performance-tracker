const {Router} = require('express');
const router = Router();
const { signup, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/*
@route POST /api/auth/signup
@desc Register a new user
@access Public
*/
router.post('/signup', signup);

/*
@route POST /api/auth/login
@desc Login a user
@access Public
*/
router.post('/login', login);

//test route
router.get('/test', protect, (req, res) => {
    res.json(req.user);
})

module.exports = router;