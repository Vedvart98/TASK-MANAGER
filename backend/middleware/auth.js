// const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization')?.replace('Bearer','').trim();
        if(!token){
            return res.status(401).json({message:'No token, authorization denied' });
        }

        // verify token
        const decoded = jwt.verify(token,process.env.your_super_secret_jwt_key);
    
        // get user from db
        const user = await User.findByPk(decoded.userId,{
            attributes:{exclude:['password']}
        });

        if(!user){
            return res.status(401).json({ message: 'user is not found' })
        }
    
        // add user to request object
        req.user = user;
        next();
    }
    catch(error){
console.error('Auth middleware error:', error);
        
if(error.name === 'JsonWebTokenError'){
    return res.status(401).json({ message: 'Invalid token'});
}else if(error.name === 'TokenExpiredError'){
    return res.status(401).json({message: 'Token expired'});
}
res.status(500).json({message:'Server error in authentication'});
}
};

module.exports = auth;
