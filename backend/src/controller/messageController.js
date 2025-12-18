const User = require('../models/userModels');
const Message = require('../models/messageModel');
const { getReciverScoketId, io } = require('../lib/socket');
const cloudinary = require('cloudinary').v2;
exports.getUser = async (req, res) => {
  try{
    const loggeduserId = req.user._id;
    const filterUser = await User.find({_id: {$ne:loggeduserId}}).select('-password');
    res.status(200).json(filterUser);
  }catch(err){
    res.status(500).json({msg:err.message});
  }
};

exports.getMessage = async (req, res) => {
  try{
    const {id:userToChatId} = req.params;
    const myId = req.user._id;

    const Messages = await Message.find({
      $or:[{senderId:myId,receiverId:userToChatId},{senderId:userToChatId,receiverId:myId}]
    })

    res.status(200).json(Messages)


  }catch(err){
    res.status(500).json({msg:err.message});
  }
};

exports.sendMessage = async (req, res) => {
  try{
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    
    if(!req.user) return res.status(401).json({ msg: "Unauthorized" });

     const {text,image} = req.body;
     const {id:receiverId} = req.params;
     const senderId = req.user._id;

     let imageUrl = null;

     if(image){
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'chatapp/messages',
        resource_type: 'auto'
      });
      imageUrl = uploadResponse.secure_url;
     }

     const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
     })


     await newMessage.save();
     
     // Real-time chat - emit to receiver
     try {
       const reciverSocketId = getReciverScoketId(receiverId);
       if(reciverSocketId){
         io.to(reciverSocketId).emit('newMessage', newMessage);
       }
     } catch(socketErr) {
       console.error('Socket error:', socketErr.message);
     }

    res.status(201).json(newMessage);
  
  }catch(err){
    console.error('Send message error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({msg:err.message});
  }
};
