const express = require('express');

const Router = express.Router();
const { scheduleMessage , getScheduledMessages ,deleteMessage } = require('../controller/scheduleController');

Router.post('/', scheduleMessage);
Router.get('/', getScheduledMessages);
Router.delete('/:id', deleteMessage);

module.exports = Router;
