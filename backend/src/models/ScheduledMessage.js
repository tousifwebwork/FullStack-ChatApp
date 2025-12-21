const mongoose = require('mongoose');

const scheduledMessageSchema = new mongoose.Schema({
  message : {type:String, required: true},
  scheduledAt: {type:Date, required: true},
});
module.exports = mongoose.model('ScheduledMessage', scheduledMessageSchema);
