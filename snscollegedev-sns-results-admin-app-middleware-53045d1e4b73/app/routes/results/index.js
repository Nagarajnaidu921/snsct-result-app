'use strict';
const path = require('path');
const errors = require(path.resolve('./helpers/errors'));
const errorHandlingMiddleware = require(path.resolve('./app/lib/error-handling-middleware'));
const Result = require(path.resolve('./app/models')).Result;
const Student = require(path.resolve('./app/models')).Student;
const express = require('express');
const router = express.Router();
const fs = require('fs');
const extractResults = require('./extract-results');
const searchCtrl = require('./search-ctrl');
const crudCtrl = require('./crud-ctrl');
const multer = require('multer');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

function makeRequiredFields() {
    const keys = ['id', 'studentId', 'sem', 'subjectCode', 'grade'];
    const options = {};
    keys.forEach(key => options[key] = true);
    options._id = false;
    return options;
}

function getFileExtension(fileName) {
    return path.extname(fileName);
}

function destination(req, file, cb) {
    cb(null, './uploads')
}

function filename(req, file, cb) {
    // console.log(file)
    const originalName = file.originalname;
    const fileExtension = getFileExtension(originalName);
    const newFileName = `results-${Date.now()}${fileExtension}`;
    cb(null, newFileName);
}

function fileFilter(req, file, cb) {
    const originalName = file.originalname;
    const fileExtension = getFileExtension(originalName);
    const isXlsxFile = fileExtension === '.xlsx';
    if (isXlsxFile) {
        // To accept the file pass `true`, like so:
        cb(null, true)
    } else if (!isXlsxFile) {
        cb(null, false)

    } else {
        // You can always pass an error if something goes wrong:
        cb(new Error('I don\'t have a clue!'))
    }
}

var storage = multer.diskStorage({ destination, filename });
const upload = multer({ storage, fileFilter });

router.route('/upload')
    .post(upload.single('results'), (req, res, next) => {
        if (!req.file) {
            const error = new Error(errors.results.FileUpload.invalidFileUpload);
            return next(error);
        }

        const xlsxFilePath = path.resolve(req.file.path);

        extractResults(xlsxFilePath)
            .then(results => Result.insertMany(results))
            .then(docs => {
                const results = docs.map(({ id, studentId, sem, subjectCode, grade }) => ({ id, studentId, sem, subjectCode, grade }));
                const isSuccess = true;
                const resData = { results, isSuccess };
                res.json(resData);
            })
            .catch(next)
    })


router.use(searchCtrl);
router.use(crudCtrl);    

router.use(errorHandlingMiddleware);
module.exports = router;