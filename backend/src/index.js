const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRouter.js');
const messageRoutes = require('./routes/messageRouter.js');
const DB = require('./lib/db.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {app,server} = require('./lib/socket.js');
const path = require('path');
dotenv.config();

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
const PORT = process.env.PORT || 3000;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());



DB.connectDB();
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../../frontend/dist')));
    app.get('/*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'../../frontend','dist','index.html'));
    })
}

server.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
})