const jwt = require('jsonwebtoken');

/**
 * Generate JWT token and set it as HTTP-only cookie
 * @param {string} userId - User's MongoDB ID
 * @param {object} res - Express response object
 * @returns {string} - Generated JWT token
 */
exports.generateToken = (userId, res) => {
  const token = jwt.sign({ userID: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
  });

  return token;
};