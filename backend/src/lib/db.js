const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 */
exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (conn) {
      console.log('MongoDB Connected');
    }
  } catch (err) {
    console.error(`Database Error: ${err.message}`);
    process.exit(1);
  }
};