const mongoose = require('mongoose');

const scheduledMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});
module.exports = mongoose.model('ScheduledMessage', scheduledMessageSchema);
