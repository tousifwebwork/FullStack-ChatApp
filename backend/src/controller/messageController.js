const User = require('../models/userModels');
const Message = require('../models/messageModel');
const SentimentModel = require('../models/sentimentModel');
const { getReciverScoketId, io } = require('../lib/socket');
const  SentimentFunction  = require('../lib/sentiment') ;
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

    // Add each user to the other's connections (two-way)
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { connections: userToJoin._id },
    });
    await User.findByIdAndUpdate(userToJoin._id, {
      $addToSet: { connections: currentUserId },
    });

    // Notify the other user via socket
    const receiverSocketId = getReciverScoketId(userToJoin._id.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('userJoined', {
        userId: currentUserId,
        fullname: req.user.fullname,
      });
    }

    res.status(200).json({
      msg: `Successfully connected with ${userToJoin.fullname}!`,
      user: {
        _id: userToJoin._id,
        fullname: userToJoin.fullname,
        profilePic: userToJoin.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.getUser = async (req, res) => {
  try {
    const loggeduserId = req.user._id;
    const currentUser = await User.findById(loggeduserId).populate('connections', '-password');
    res.status(200).json(currentUser.connections || []);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.sendMessage = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'chatapp/messages',
        resource_type: 'auto',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Store sentiment analysis if there's text
    if (text && text.trim()) {
      try {
        const SentimentFunction = require('../lib/sentiment');
        const SentimentModel = require('../models/sentimentModel');
        const Score = SentimentFunction(text);
        
        // Generate consistent chatId using sorted user IDs
        const chatId = [senderId.toString(), receiverId.toString()].sort().join('_');
        
        await SentimentModel.create({
          chatId: chatId,
          senderId: senderId,
          text: text,
          sentiment: Score
        });
        console.log('Sentiment stored for message:', { chatId: chatId, sentiment: Score });
      } catch (sentimentError) {
        console.error('Failed to store sentiment:', sentimentError);
      }
    }

    // Real-time: emit to receiver's socket
    const reciverSocketId = getReciverScoketId(receiverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

