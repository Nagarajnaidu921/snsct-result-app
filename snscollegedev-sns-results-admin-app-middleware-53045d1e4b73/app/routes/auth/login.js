'use strict';
const path = require('path');
const errorHandlingMiddleware = require(path.resolve('./app/lib/error-handling-middleware'));
const errors = require(path.resolve('./helpers/errors'));
const express = require('express');
const router = express.Router();
const Admin = require(path.resolve('./app/models')).Admin;

router.route('/')
    .post((req, res, next) => {
        const body = req.body || {};
        const email = body.email;
        const password = body.password;

        if (email && password) {
            const message = 'Successfully Logged In';
            return Admin.login({email, password})
                .then(token => {
                    const isSuccess = true;
                    const resData = { token, message, isSuccess };
                    res.json(resData);
                })
                .catch(next)
        }

        if (!email) {
            const error = new Error(errors.login.email.missing);
            return next(error);
        }

        if (!password) {
            const error = new Error(errors.login.password.missing);
            return next(error);
        }


    })


router.use(errorHandlingMiddleware);
module.exports = router;
