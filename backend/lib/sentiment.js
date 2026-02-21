const Sentiment = require('sentiment');

const sentiment =  new Sentiment();

const SentimentFunction = (text) => {
  return sentiment.analyze(text).score;
}

module.exports = SentimentFunction;