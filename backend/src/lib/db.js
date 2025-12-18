const mongoose = require('mongoose');

exports.connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        if(conn){
        console.log(`MongoDB Connected`);
        }
    }catch(err){
        console.error(`Error: ${err.message}`);
    }
}