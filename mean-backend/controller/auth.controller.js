const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (user)=>{
    const {_id, name, role} =user;
    return jwt.sign(
        {_id,name,role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE}
    );
}

const register = async (req, res)=>{
    try {
        const {name, email, password, phone,gender} = req.body;
        
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({success:false, message:"Email Already registerd Before!"})
        }
        const user = await User.create({name,email,password,phone,gender})
        const token = generateToken(user);

        res.status(201).json({
            success:true,
            message:'Registration successful',
            token
        })

    }
    catch(error){
        res .status(500).json({success:false,message:error.message});
    }
}

const login = async (req, res)=>{
    try{
    const {email, password} = req.body;
    if (!email || ! password ){
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({email}).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.json({
        success:true,
        message:'Login Successul',
        token,
        user:{
           _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        image: user.image
        }
    })    
    }
    catch(error){
    res.status(500).json({ success: false, message: error.message });
    }
}

module.exports= {register, login}
