'use strict';
const path = require('path');
const errorHandlingMiddleware = require(path.resolve('./app/lib/error-handling-middleware'));
const Student = require(path.resolve('./app/models')).Student;
const express = require('express');
const router = express.Router();


function makeRequiredFields() {
    const keys = ['id', 'registerNumber', 'email', 'fullName', 'isActive', 'gender'];
    const options = {};
    keys.forEach(key => options[key] = true);
    options._id = false;
    return options;
}

router.route('/')
    .get((req, res, next) => {
        const options = makeRequiredFields();
        Student.find({ isActive: true }, options).exec()
            .then(students => {
                res.json({ students, isSuccess: true })
            })
            .catch(next)
    })
    .post((req, res, next) => {
        const student = req.body || {};
        Student.createNew(student)
            .then(student => {
                const resData = {};
                resData.isSuccess = false;

                if (student) {
                    resData.isSuccess = true;
                    const keys = ['id', 'registerNumber', 'email', 'fullName', 'isActive', 'gender'];
                    resData.student = {};
                    keys.forEach(key => resData.student[key] = student[key]);
                };

                res.json(resData);
            })
            .catch(next)
    })



function isStudentIdExist(req, res, next) {
    const id = req.params.id;
    if (!id) {
        const error = new Error('Student ID Should Not Be Empty');
        return next(error);
    } else {
        next();
    }
}

router.route('/:id')
    .get(isStudentIdExist, (req, res, next) => {
        const id = req.params.id;
        const options = makeRequiredFields();

        Student.findOne({ id, isActive: true }, options).exec()
            .then(student => {
                if (student) {
                    res.json({ student, isSuccess: true });
                } else {
                    res.json({ student, isSuccess: false });
                }
            })
            .catch(next);
    })
    .put(isStudentIdExist, (req, res, next) => {
        const id = req.params.id;
        const options = makeRequiredFields();
        const body = req.body || {};
        const findQuery = { id, isActive: true };
        const defaultOptions = { new: true, fields: options };

        function checkEmailExist(email) {
            return Student.findOne({ email }).exec()
                .then(student => {
                    if (student && student.id !== id) {
                        const error = new Error('Student With This Email ID Already Exist');
                        return Promise.reject(error);
                    } else {
                        return student;
                    }
                })
        }

        function findOneAndUpdate(updateValuesObj) {
            return Student.findOneAndUpdate(findQuery, updateValuesObj, defaultOptions).exec();
        }

        function updateFields() {
            const keys = ['registerNumber', 'email', 'fullName', 'gender', 'password'].filter(key => body[key]);
            if (keys.length === 0) {
                const error = new Error('No Update Params')
                return Promise.reject(error);
            }

            const updateObj = {};
            keys.forEach(key => updateObj[key] = body[key]);

            if (keys.includes('password')) {
                const password = body.password;
                return Student.resetPassword({ id, password, options })
            } else {
                if (keys.includes('email')) {
                    return checkEmailExist(body.email)
                        .then(student => findOneAndUpdate(updateObj))
                }
                return findOneAndUpdate(updateObj)
            }

        }

        updateFields()
            .then(student => {
                const isSuccess = true;
                res.json({ isSuccess, student });
            })
            .catch(next)
    })
    .delete(isStudentIdExist, (req, res, next) => {
        const id = req.params.id;

        const options = makeRequiredFields();

        Student.findOneAndUpdate({ id, isActive: true }, { isActive: false }, { new: true, fields: options }).exec()
            .then(student => {
                res.json({ student, isSuccess: true });
            })
            .catch(next);
    })


router.use(errorHandlingMiddleware);

module.exports = router;
