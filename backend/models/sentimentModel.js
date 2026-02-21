const mongoose = require('mongoose');

const sentimentSchema = new mongoose.Schema({
  chatId: String,
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  sentiment: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sentiment', sentimentSchema);