const express = require('express');
const router = express.Router();
const {signup, login} = require('../controllers/authController');
const {protect} = require('../middleware/authMiddleware');

//SIGNUP ROUTE
router.post('/signup', signup);

//LOGIN ROUTE
router.post('/login', login);

//test route
router.get('/test', protect, (req,res)=>{
    res.json(req.user);
})

module.exports = router;