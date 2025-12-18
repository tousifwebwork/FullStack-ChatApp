const express = require('express');
const Router = express.Router();
const {protectRoute} = require('../middleware/authMiddleware');
const {getUser,getMessage,sendMessage} = require('../controller/messageController')


Router.get('/users',protectRoute,getUser);
Router.get('/:id',protectRoute,getMessage);
Router.post('/send/:id',protectRoute,sendMessage);



module.exports = Router;