const express = require('express');
const Router = express.Router();
const { AutoMessage } = require('../controller/AutoMessage')
 
Router.post('/reply', AutoMessage);

module.exports = Router;