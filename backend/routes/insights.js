const express = require('express');
const Router = express.Router();
const { insightsController } = require('../controller/insightsController');
const { protectRoute } = require('../middleware/authMiddleware.js');
const { getInviteCode } = require('../jobs/InvitecodeAPI.js');

Router.get('/insights/:chatId', protectRoute, insightsController);
Router.get("/invite-code", protectRoute, getInviteCode);


module.exports = Router;