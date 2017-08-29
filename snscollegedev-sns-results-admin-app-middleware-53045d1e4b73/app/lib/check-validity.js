'use strict';
/* This Module Is For Checking Validty Of Different Kinds Of App's Data Such As
 * Student's Register Number, Subject Code.. etc 
 */
const validRegisterNumberPattern = /^[1-9][1-9](au|ae|ag|bm|ce|cp|cs|ee|ei|ec|it|mc|me|ma)[0-9][0-9][0-9]$/;
const validSubjectCodes = 'EC123,EC124,EC125,EC126,EC127,EC128'.split(',');
const validGrades = ['S', 'A', 'B', 'C', 'D', 'E', 'RA'];
const validSems = [1, 2, 3, 4, 5, 6, 7, 8];
/* 
 * This function will check wether given register Number is valid or not
 * @param {object}
 */
function isValidRegisterNumber({ registerNumber }) {
    const isValid = registerNumber && validRegisterNumberPattern.test(registerNumber);
    return isValid;
}


/*
 * This will check whether given grade value is valid or not..
 * @params {string}
 */
function isValidGrade(grade) {
    return validGrades.includes(grade);
}


/*
 * This will check whether given subject code value is valid one or not..
 * @params {string}
 */
function isValidSubjectCode(subjectCode) {
    return validSubjectCodes.includes(subjectCode);
}

/*
 * This will check whether given sem value is valid one or not..
 * @params {number}
 */
function isValidSem(sem) {
    return validSems.includes(sem);
}

module.exports = {
	isValidRegisterNumber,
	isValidGrade,
	isValidSubjectCode,
	isValidSem,
};