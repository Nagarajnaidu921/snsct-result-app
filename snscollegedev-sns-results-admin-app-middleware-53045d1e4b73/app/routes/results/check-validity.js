'use strict';

const path = require('path');
const errors = require(path.resolve('./helpers/errors'));
const Student = require(path.resolve('./app/models')).Student;
const checkValidity = require(path.resolve('./app/lib/check-validity'));
const isValidRegisterNumber = checkValidity.isValidRegisterNumber;
const isValidGrade = checkValidity.isValidGrade;
const isValidSubjectCode = checkValidity.isValidSubjectCode;
const isValidSem = checkValidity.isValidSem;

// This Will Chect Whether All Student Id's Are Valid.
function isAllRegisterNumbersValid(results = []) {
    return results.every(isValidRegisterNumber);
}

function isGradesSubjectsSemsValid(results = []) {
    const grades = [];
    const subjectCodes = [];
    const sems = []; 
    results.forEach(result => {
        grades.push(result.grade);
        subjectCodes.push(result.subjectCode);
        sems.push(result.sem);
    });

    const isAllGradesValid = [...new Set(grades)].every(isValidGrade);
    const isAllSubjectsValid = [...new Set(subjectCodes)].every(isValidSubjectCode);
    const isAllSemValuesAreValid = [...new Set(sems)].every(isValidSem);

    if (isAllGradesValid && isAllSubjectsValid && isAllSemValuesAreValid) {
        return results;
    }

    if (!isAllGradesValid) {
        throw new Error(errors.results.FileUpload.invalidGrades);
    }

    if (!isAllSubjectsValid) {
        throw new Error(errors.results.FileUpload.invalidSubjectCodes);
    }

     if (!isAllSemValuesAreValid) {
        throw new Error(errors.results.FileUpload.invalidSemValues);
    }
}

// This function will check whether all register numbers
// present in uploaded data are present in database or not
function isAllStudentsExistInDB(registerNumbers = []) {

    return Student.find({ registerNumber: { $in: registerNumbers } }, { id: true, registerNumber: true, _id: false }).exec()
        .then(students => {
            const isAllStudentsExist = (students.length > 0) && (students.length === registerNumbers.length);
            if (isAllStudentsExist) {
                return students;
            } else {
                throw new Error(errors.results.FileUpload.unknownRegisterNumbers);
            }
        })
}


module.exports = {
	isAllRegisterNumbersValid,
	isGradesSubjectsSemsValid,
	isAllStudentsExistInDB,
};