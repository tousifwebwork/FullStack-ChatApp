const mongoose =  require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    fullname:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    profilePic:{
        type: String,
        default:''
    },
    lastMessageTime:{
        type: Date,
        default: new Date(0)
    }
 }
  , { timestamps:true } 
    
);

module.exports = mongoose.model('User', userSchema);