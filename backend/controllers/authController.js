const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const saltRounds =10;

const signup = async (req,res,next)=>{
    try{
    const {name, email,password,role} = req.body;

    //1. Check if user already exists
    const userExists = await User.findOne({email: email});
    if(userExists){
        return res.status(409).json({message: "An account with this email already exists."})
    }

    //2. Hash Password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password,salt);

    //3. Create user in Database
    const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        classes:[],
        role: role || 'student'
    })

    //4. Generate JWT
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );

    res.status(201).json({
        _id : user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        classes: user.classes,
        token
    });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}


const login = async (req, res, next)=>{
    try{
    const {email, password} = req.body;
    //1. check if User exists or not
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(401).json({message:"User not found"})
    }

    //2. if credentials true or not
    const result = await bcrypt.compare(password,user.password);
    if(!result){
        return res.status(401).json({message:"User not found"});
    }
    // 3. generate token
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        classes: user.classes,
        token
    })
    }catch(error){
        res.status(500).json({message: error.message});
    }

}

module.exports = {
    signup,
    login
};