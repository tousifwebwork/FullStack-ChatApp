const express = require('express');
const Router = express.Router();
const authController = require('../controller/authController.js');
const { protectRoute } = require('../middleware/authMiddleware.js');

// Public routes
Router.post('/signup', authController.signup);
Router.post('/login', authController.login);
Router.post('/logout', authController.logout);

// Protected routes
Router.get('/check', protectRoute, authController.checkAuth);
Router.put('/update-profile', protectRoute, authController.updateProfile);

module.exports = Router;