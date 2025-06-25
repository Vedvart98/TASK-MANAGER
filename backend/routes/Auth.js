const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const generateToken = (userId)=>{
    return jwt.sign({userId},process.env.your_super_secret_jwt_key,{
        expiresIn:'7d'
    });
};

router.post('/signup',async(req,res)=>{
    try{
        const {name,email,password} = req.body;

        // validate ipnut
        if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and password' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({where:{email}});
    if(existingUser){
        return res.status(400).json({
             message: 'User already exists with this email' 
        });
    } 
    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

const token = generateToken(user.id);
res.status(201).json({
    message:'User registerd sucessfully',
    token,
    user:{
        id:user.id,
        name:user.name,
        email:user.email
    }
});

    }catch(error){
        console.log('Signup error:', error);
        if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
    }
});

router.post('/login',async(req,res)=>{
    try{
const {email,password} = req.body;
// validate input
if(!email || !password){
 return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if(!user){
        return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }
// check password
    const isMatch = await user.matchPassword(password);
     if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user.id);
    res.json({
        message:'Login successful',
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email
        }
    });

    }catch(error){
        console.error('Login error: ',error);
        res.status(500).json({message:'Server error during login'});
    }
});

module.exports = router;