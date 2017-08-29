'use strict';
const path = require('path');
const errors = require(path.resolve('./helpers/errors'));
const checkValidity = require(path.resolve('./app/lib/check-validity'));
const errorHandlingMiddleware = require(path.resolve('./app/lib/error-handling-middleware'));
const Result = require(path.resolve('./app/models')).Result;
const Student = require(path.resolve('./app/models')).Student;
const express = require('express');
const router = express.Router();
const { isValidRegisterNumber, isValidGrade, isValidSubjectCode, isValidSem } = checkValidity;

function makeRequiredFields() {
    const keys = ['id', 'studentId', 'sem', 'subjectCode', 'grade'];
    const options = {};
    keys.forEach(key => options[key] = true);
    options._id = false;
    return options;
}

router.route('/:id')
    .put((req, res, next) => {
        const id = req.params.id;

        const body = req.body || {};
        const keys = ['studentId', 'sem', 'subjectCode', 'grade'].filter(key => body[key]);
        const updateObj = {};
        keys.forEach(key => updateObj[key] = body[key]);

        const isInvalid = {};
        isInvalid.grade = updateObj.grade && (!isValidGrade(updateObj.grade));
        isInvalid.subjectCode = updateObj.subjectCode && (!isValidSubjectCode(updateObj.subjectCode));
        isInvalid.sem = updateObj.sem && (!isValidSem(updateObj.sem));

        if (isInvalid.grade) {
            const error = new Error(errors.results.resultUpdate.invalidGrade);
            return next(error);
        }

        if (isInvalid.subjectCode) {
            const error = new Error(errors.results.resultUpdate.invalidSubjectCode);
            return next(error);
        }

        if (isInvalid.sem) {
            const error = new Error(errors.results.resultUpdate.invalidSem);
            return next(error);
        }

        const fields = makeRequiredFields();
        const defaultOptions = { new: true, fields };

        Result.findOneAndUpdate({ id }, updateObj, defaultOptions).exec()
            .then(result => {
                const isSuccess = true;
                const resData = { result, isSuccess };
                res.json(resData);
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const id = req.params.id;
        Result.findOneAndRemove({ id }).exec()
            .then(result => {
                const isSuccess = true;
                res.json({ isSuccess, result });
            })
            .catch(next)
    })

module.exports = router;