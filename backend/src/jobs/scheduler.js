const cron = require('node-cron');
const ScheduledMessage = require('../models/ScheduledMessage');
const Message = require('../models/messageModel');
const { io } = require('../lib/socket');

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const messages = await ScheduledMessage.find({ scheduledAt: { $lte: now } });
  for (let msg of messages) {
    // Create chat message
    const newMessage = await Message.create({
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      text: msg.message,
    });
    // Emit to receiver via socket.io
    if (io) {
      io.to(msg.receiverId.toString()).emit('newMessage', newMessage);
    }
    // Delete scheduled message
    await ScheduledMessage.deleteOne({ _id: msg._id });
    console.log('Scheduled message sent and delivered:', msg.message);
  }
});