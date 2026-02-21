const express = require('express');
const Router = express.Router();
const { insightsController } = require('../controller/insightsController');
const { protectRoute } = require('../middleware/authMiddleware.js');

Router.get('/insights/:chatId', protectRoute, insightsController);

module.exports = Router;