const jwt = require('jsonwebtoken');

exports.generateToken = (userId) => {
  const token = jwt.sign({ userID: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return token;
};