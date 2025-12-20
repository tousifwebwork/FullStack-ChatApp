const User = require('../models/userModels');
const Message = require('../models/messageModel');
const { getReciverScoketId, io } = require('../lib/socket');
const cloudinary = require('cloudinary').v2;

/**
 * Join a user by their invite code
 * Creates a two-way connection between users
 */
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

/**
 * Get all connected users for the logged-in user
 */
exports.getUser = async (req, res) => {
  try {
    const loggeduserId = req.user._id;
    const currentUser = await User.findById(loggeduserId).populate('connections', '-password');
    res.status(200).json(currentUser.connections || []);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Get all messages between current user and specified user
 */
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

/**
 * Send a message to a user (text and/or image)
 * Uploads image to Cloudinary if provided
 * Emits real-time event to receiver via Socket.IO
 */
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
