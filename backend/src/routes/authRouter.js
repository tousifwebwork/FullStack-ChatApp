const express = require('express');
const authController = require('../controller/authController.js');
const PR = require('../middleware/authMiddleware.js')
const CA = require('../controller/authController.js')
const Router = express.Router();
    
Router.post('/signup',authController.signup)
Router.post('/login',authController.login)
Router.post('/logout',authController.logout)

Router.put('/update-profile', PR.protectRoute , authController.updateProfile)


Router.get('/check' ,PR.protectRoute , CA.checkAuth)


module.exports = Router;