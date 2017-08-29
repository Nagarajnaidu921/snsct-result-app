const fs = require('fs');
const path = require('path');
const errors = require(path.resolve('./helpers/errors'));
const convertExcel = require('excel-as-json').processFile;
const checkValidity = require('./check-validity');

// Extract File Extension From Given FileName
function getFileExtension(fileName) {
    return path.extname(fileName);
}

// Check Wether The Xlsx file exist or Not
function isExcelPresent(excelFilePath) {
    return fs.existsSync(excelFilePath);
}

// Check Whether The Given File Is Xlsx File Or Not
function isXlsxFile(filePath) {
    const fileExtension = getFileExtension(filePath);
    return (fileExtension === '.xlsx');
}


/**
 * This Will Transform Extracted From Excel file Into Required Format Which We need to insert the data into database.
 * @param {array} data - Data Extracted From Uploaded Excel File.
 * @param {array} students - Student Details Gathered From Student's Collection.
 */
function transformData(data, students) {
    const results = [];
    data.forEach(obj => {
        const student = students.find(student => (student.registerNumber === obj.registerNumber));
        const studentId = student.id;
        const sem = obj.sem;
        
        Object.keys(obj).forEach(x => {
            if (('registerNumber' !== x) && ('sem' !== x)) {
                const subjectCode = x;
                const grade = obj[x];
                results.push({ studentId, sem, subjectCode, grade });
            }
        })
    })

    return results;
}


function extractDataFromExcel(excelFilePath) {
    return new Promise((resolve, reject) => {
        convertExcel(excelFilePath, null, { omitEmptyFields: true }, (error, data) => {
            if (error) {
                reject(error);
            }

            if (data && checkValidity.isAllRegisterNumbersValid(data)) {
                var registerNumbers = [...new Set(data.map(x => x.registerNumber))];
                checkValidity.isAllStudentsExistInDB(registerNumbers)
                    .then(students => transformData(data, students))
                    .then(checkValidity.isGradesSubjectsSemsValid)
                    .then(resolve)
                    .catch(reject)
            } else {
                const error = new Error(errors.results.FileUpload.invalidRegisterNumbers);
                reject(error);
            }
        })
    })
}

function extractResults(excelFilePath) {
    if (!isExcelPresent(excelFilePath)) {
        const error = new Error(errors.results.FileUpload.fileNotExist);
        return Promise.reject(error);
    }

    if (!isXlsxFile(excelFilePath)) {
        const error = new Error(errors.results.FileUpload.notXlsx);
        return Promise.reject(error);
    }

    return extractDataFromExcel(excelFilePath)
}


module.exports = extractResults;