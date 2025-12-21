const ScheduledMessage = require('../models/ScheduledMessage');

exports.scheduleMessage = async (req,res) =>{
    const {message, scheduledAt} = req.body;
    try{
        const data = await ScheduledMessage.create({message, scheduledAt}); 
        res.json(data);
    }catch(err){
        res.status(500).json({error: 'Failed to schedule message'});
    }
}

exports.getScheduledMessages = async (req, res) => {
  try {
    const messages = await ScheduledMessage.find().sort({ scheduledAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scheduled messages' });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await ScheduledMessage.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

