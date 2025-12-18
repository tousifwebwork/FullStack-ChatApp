
const jwt = require('jsonwebtoken');

exports.generateToken = (user, res) => {
    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development'
    });
    return token;
}