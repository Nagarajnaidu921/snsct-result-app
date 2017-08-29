'use strict';
const sendMail = require('../../lib/send-mail');
const path = require('path');
const User = require(path.resolve('./app/db/user'));
const express = require('express');
const router = express.Router();

router.route('/:userId/:emailVerificationId')
    .get((req, res, next) => {
        const params = req.params || {};
        const userId = params.userId;
        const emailVerificationId = params.emailVerificationId;
        const query = { userId: userId };

        User.find(query)
            .then(user => {
                if (user.email_verification_id === emailVerificationId) {
                    User.update(query, { isActive: 1, emailVerificationId: null })
                        .then(isUpdated => {
                            if (isUpdated) {
                                res.send('Your Email Verified Successfully, You Can Login Now..');
                            }
                        })
                } else {
                    const error = new Error('Link Expired');
                    next(error);
                }
            })
    })

router.use((error, req, res, next) => {

    const message = error.message;
    const resData = {
        message: message
    };

    res.status(200).json(resData);
})


module.exports = router;
