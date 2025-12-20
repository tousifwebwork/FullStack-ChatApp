const User = require('../models/userModels');
const Message = require('../models/messageModel');
const { getReciverScoketId, io } = require('../lib/socket');
const cloudinary = require('cloudinary').v2;

exports.joinByInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const currentUserId = req.user._id;

    if (!inviteCode) {
      return res.status(400).json({ msg: 'Invite code is required' });
    }

    // Find user with this invite code
    const userToJoin = await User.findOne({ inviteCode: inviteCode.trim() });

    if (!userToJoin) {
      return res.status(404).json({ msg: 'Invalid invite code' });
    }

    // Check if trying to join self
    if (userToJoin._id.toString() === currentUserId.toString()) {
      return res.status(400).json({ msg: 'You cannot join yourself' });
    }

    // Check if already connected
    const currentUser = await User.findById(currentUserId);
    if (currentUser.connections.includes(userToJoin._id)) {
      return res.status(400).json({ msg: 'Already connected with this user' });
    }

    // Add each user to the other's connections
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { connections: userToJoin._id }
    });
    await User.findByIdAndUpdate(userToJoin._id, {
      $addToSet: { connections: currentUserId }
    });

    // Notify the other user via socket that someone joined
    const receiverSocketId = getReciverScoketId(userToJoin._id.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userJoined', {
        userId: currentUserId,
        fullname: req.user.fullname
      });
    }

    res.status(200).json({ 
      msg: `Successfully connected with ${userToJoin.fullname}!`,
      user: {
        _id: userToJoin._id,
        fullname: userToJoin.fullname,
        profilePic: userToJoin.profilePic
      }
    });

  } catch (err) {
    console.error('Join by invite code error:', err.message);
    res.status(500).json({ msg: err.message });
  }
};

exports.getUser = async (req, res) => {
  try{
    const loggeduserId = req.user._id;
    const currentUser = await User.findById(loggeduserId).populate('connections', '-password');
    res.status(200).json(currentUser.connections || []);
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
