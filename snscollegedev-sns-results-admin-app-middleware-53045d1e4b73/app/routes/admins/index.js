'use strict';
const path = require('path');
const errorHandlingMiddleware = require(path.resolve('./app/lib/error-handling-middleware'));
const Admin = require(path.resolve('./app/models')).Admin;
const express = require('express');
const router = express.Router();


function makeRequiredFields() {
    const keys = ['id', 'email', 'fullName', 'isActive'];
    const options = {};
    keys.forEach(key => options[key] = true);
    options._id = false;
    return options;
}

router.route('/')
    .get((req, res, next) => {
        const options = makeRequiredFields();
        Admin.find({ isActive: true }, options).exec()
            .then(admins => {
                res.json({ admins, isSuccess: true })
            })
            .catch(next)
    })
    .post((req, res, next) => {
        const admin = req.body || {};
        Admin.createNew(admin)
            .then(admin => {
                const resData = {};
                resData.isSuccess = false;

                if (admin) {
                    resData.isSuccess = true;
                    const keys = ['id', 'email', 'fullName', 'isActive'];
                    resData.admin = {};
                    keys.forEach(key => resData.admin[key] = admin[key]);
                };

                res.json(resData);
            })
            .catch(next)
    })



function isAdminIdExist(req, res, next) {
    const id = req.params.adminID;
    if (!id) {
        const error = new Error('Admin ID Should Not Be Empty');
        return next(error);
    } else {
        next();
    }
}

router.route('/:adminID')
    .get(isAdminIdExist, (req, res, next) => {
        const id = req.params.adminID;
        const options = makeRequiredFields();

        Admin.findOne({ id, isActive: true }, options).exec()
            .then(admin => {
                res.json({ admin, isSuccess: true });
            })
            .catch(next);
    })
    .put(isAdminIdExist, (req, res, next) => {
        const id = req.params.adminID;
        const options = makeRequiredFields();
        const body = req.body || {};
        const findQuery = { id, isActive: true };
        const defaultOptions = { new: true, fields: options };

        function checkEmailExist(email) {
            return Admin.findOne({ email }).exec()
                .then(admin => {
                    if (admin && admin.id !== id) {
                        const error = new Error('Admin With This Email ID Already Exist');
                        return Promise.reject(error);
                    } else {
                        return admin;
                    }
                })
        }

        function updateFields() {
            if (body.password) {
                const password = body.password;
                return Admin.resetPassword({ id, password, options })
            } else if (body.email && body.fullName) {
                const email = body.email;
                const fullName = body.fullName;
                return checkEmailExist(email)
                    .then(admin => {
                        return Admin.findOneAndUpdate(findQuery, { email, fullName }, defaultOptions).exec();
                    })
            } else if (body.email) {
                const email = body.email;
                return checkEmailExist(email)
                    .then(admin => {
                        return Admin.findOneAndUpdate(findQuery, { email }, defaultOptions).exec();
                    })
            } else if (body.fullName) {
                const fullName = body.fullName;
                return Admin.findOneAndUpdate(findQuery, { fullName }, defaultOptions).exec();
            }

        }

        updateFields()
            .then(admin => {
                const isSuccess = true;
                res.json({ isSuccess, admin });
            })
            .catch(next)
    })
    .delete(isAdminIdExist, (req, res, next) => {
        const id = req.params.adminID;

        const options = makeRequiredFields();

        Admin.findOneAndUpdate({ id, isActive: true }, { isActive: false }, { new: true, fields: options }).exec()
            .then(admin => {
                res.json({ admin, isSuccess: true });
            })
            .catch(next);
    })


router.use(errorHandlingMiddleware);
module.exports = router;
