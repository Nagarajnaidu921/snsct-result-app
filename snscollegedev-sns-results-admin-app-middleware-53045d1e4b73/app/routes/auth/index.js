'use strict';
const express     = require('express');
const router      = express.Router();
const login       = require('./login');
// const forgotPassword = require('./forgot-password');
// const resetPassword = require('./reset-password');
// const verifyEmail = require('./verify-email');

// const AuthRoutes = { register, login, fbLogin, googleLogin };

router.use('/login', login);
// router.use('/forgot-password', forgotPassword);
// router.use('/reset-password', resetPassword);
// router.use('/verify-email', verifyEmail);

// module.exports = AuthRoutes
module.exports = router