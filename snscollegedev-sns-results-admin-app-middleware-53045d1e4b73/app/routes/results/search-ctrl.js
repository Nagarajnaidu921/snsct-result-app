'use strict';
const path = require('path');
const errors = require(path.resolve('./helpers/errors'));
const errorHandlingMiddleware = require(path.resolve('./app/lib/error-handling-middleware'));
const Result = require(path.resolve('./app/models')).Result;
const Student = require(path.resolve('./app/models')).Student;
const express = require('express');
const router = express.Router();
const checkValidity = require(path.resolve('./app/lib/check-validity'));
const isValidRegisterNumber = checkValidity.isValidRegisterNumber;

const requiredStudentFields = {
    _id: false,
    id: true,
    registerNumber: true,
    fullName: true,
    email: true,
    gender: true,
    isActive: true
};

function makeRequiredFields() {
    const keys = ['id', 'studentId', 'sem', 'subjectCode', 'grade'];
    const options = {};
    keys.forEach(key => options[key] = true);
    options._id = false;
    return options;
}

router.route('/search')
    .get((req, res, next) => {
        const { registerNumber } = (req.query || {});
        const resData = {};
        
        if (!isValidRegisterNumber({ registerNumber })) {
            const error = new Error('Invalid Student Id');
            return next(error);
        }

        Student.findOne({ registerNumber }, requiredStudentFields).exec()
            .then(student => {
                if (!student) {
                    throw new Error('Student Id Doesn\'t Exist');
                }
                resData.student = student;
                const studentId = student.id;
                const requiredResultFields = makeRequiredFields();
                return Result.find({ studentId }, requiredResultFields).exec();
            })
            .then(results => {
                resData.isSuccess = true;
                resData.results = results;
                res.json(resData);
            })
            .catch(next)


    })

module.exports = router;