const ScheduledMessage = require('../models/ScheduledMessage');

exports.scheduleMessage = async (req, res) => {
  const { message, scheduledAt, receiverId } = req.body;
  try {
    // senderId from authenticated user
    const senderId = req.user && req.user._id;
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'Missing sender or receiver' });
    }
    const data = await ScheduledMessage.create({
      message,
      scheduledAt,
      senderId,
      receiverId
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to schedule message' });
  }
}

exports.getScheduledMessages = async (req, res) => {
  try {
    // Only return messages for the authenticated user
    const senderId = req.user._id;
    const messages = await ScheduledMessage.find({ senderId: senderId }).sort({ scheduledAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scheduled messages' });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    // Only allow users to delete their own messages
    const senderId = req.user._id;
    const message = await ScheduledMessage.findOneAndDelete({ _id: id, senderId: senderId });
    if (!message) {
      return res.status(404).json({ error: 'Message not found or not authorized' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

