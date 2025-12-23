const express = require('express');

const Router = express.Router();

const { protectRoute } = require('../middleware/authMiddleware');
const { scheduleMessage, getScheduledMessages, deleteMessage } = require('../controller/scheduleController');

Router.post('/', protectRoute, scheduleMessage);
Router.get('/', getScheduledMessages);
Router.delete('/:id', deleteMessage);

module.exports = Router;
