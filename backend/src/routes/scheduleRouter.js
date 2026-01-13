const express = require('express');

const Router = express.Router();

const { protectRoute } = require('../middleware/authMiddleware');
const { scheduleMessage, getScheduledMessages, deleteMessage } = require('../controller/scheduleController');

Router.post('/', protectRoute, scheduleMessage);
Router.get('/', protectRoute, getScheduledMessages);
Router.delete('/:id', protectRoute, deleteMessage);

module.exports = Router;
