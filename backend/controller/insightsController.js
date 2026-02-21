const SentimentModel = require('../models/sentimentModel')

exports.insightsController = async (req,res)=>{
  try {
    const chatId = req.params.chatId;
    console.log('Getting insights for chatId:', chatId);
    
    const messages = await SentimentModel.find({ chatId: chatId });
    console.log('Found messages:', messages.length);
     
    let positive = 0;
    let negative = 0;

    messages.forEach(msg => {
      if (msg.sentiment > 0) positive++;
      if (msg.sentiment < 0) negative++;
    });

    console.log('Sentiment counts - positive:', positive, 'negative:', negative);
    res.json({ positive, negative });
  } catch (error) {
    console.error('Error in insightsController:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
}