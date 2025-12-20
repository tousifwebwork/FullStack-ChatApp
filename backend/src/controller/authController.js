const User = require('../models/userModels')
const bcrypt = require("bcryptjs");
const token = require('../lib/utils');
const cloudinary = require('cloudinary').v2;



exports.signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if(!fullname || !email ){
    return res.status(400).json({ msg: "Please enter all fields." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long." });
    }

   const user = await User.findOne({email})
   if(user){
    return res.status(400).json({ msg: "Email already exists." });
   }

   const inviteCode = Math.floor(10000 + Math.random() * 90000).toString();
   const salt = await bcrypt.genSalt(10);
   const hasPasword = await bcrypt.hash(password, salt);
   const newUser = new User({
    fullname:fullname.trim(),
    email:email.trim().toLowerCase(),
    password: hasPasword,
    inviteCode
   })

   if(newUser){
     await newUser.save();
    token.generateToken(newUser._id,res);
   
    res.status(201).json({
      _id:newUser._id,
      fullname:newUser.fullname,
      email:newUser.email,
      profilePic:newUser.profilePic,
      inviteCode:newUser.inviteCode
    }, {msg:'User registered successfully'});
    
   }else{
    return res.status(400).json({msg:'Error in Saving data'})
   }
  } catch (err) {
      console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
   try{
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({ msg: "Invalid email." });
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({ msg: "Invalid password." });
    }

    token.generateToken(user._id,res);
    res.status(200).json({
      _id:user._id,
      fullname:user.fullname,
      email:user.email,
      profilePic:user.profilePic
    })

   }catch(err){
    console.log('Error')
   }
};



exports.logout = (req, res) => {
  try{
    res.cookie('jwt','',{maxAge:0});
    return res.status(200).json({ msg: "Logged out successfully." });
  }catch(err){
    console.log('Error')
    return res.status(500).json({ msg: "Server error" });
  }
};



exports.checkAuth = (req,res)=>{
  try{
    res.status(200).json(req.user);
  }catch(err){
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
}



exports.updateProfile = async (req,res)=>{
try{
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
  
  const {profilePic} = req.body;
  const userID = req.user._id;
  if(!profilePic){
    return res.status(400).json({ msg: "Profile picture is required." });
  }
  const uploadResponse = await cloudinary.uploader.upload(profilePic, {
    folder: 'chatapp/profiles',
    resource_type: 'auto'
  });
  
  const updatedUser = await User.findByIdAndUpdate(userID,{profilePic:uploadResponse.secure_url},{new:true})
  res.status(200).json(updatedUser);
}catch(err){
  console.error('Profile update error:', err.message);
  res.status(500).json({ msg: "Error: " + err.message });  
}
}


