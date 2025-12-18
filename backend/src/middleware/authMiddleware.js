const jwt = require('jsonwebtoken');
const User = require('../models/userModels');


exports.protectRoute = async (req,res,next) =>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({ msg: "Not authorized, no token" });
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        
        if(!decoded){
            return res.status(401).json({ msg: "Not authorized, token failed" });
        }

        const user = await User.findById(decoded.userID).select('-password');
        if(!user){
            return res.status(401).json({ msg: "Not authorized, user not found" });
        }
        req.user = user;
        next();
        

    }catch(err){
        console.error(err);
        res.status(401).json({ msg: "Not authorized, token failed" });
    }
}
