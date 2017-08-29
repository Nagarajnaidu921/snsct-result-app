'use strict';
const errors = {};

errors.FileUpload = {};
errors.FileUpload.notXlsx = 'This is not xlsx file';
errors.FileUpload.fileNotExist = 'Excel File Not Exist In Path';
errors.FileUpload.invalidRegisterNumbers = 'Invalid Register Numbers Are Present In Data';
errors.FileUpload.unknownRegisterNumbers = 'Unknown Register Numbers: Some Register Numbers Not Exist In Our Database';
errors.FileUpload.invalidGrades = 'Invalid Grades Are Present In Data';
errors.FileUpload.invalidSubjectCodes = 'Invalid Subject Codes Are Present In Data';
errors.FileUpload.invalidSemValues = 'Invalid Sem Values Are Present In Data';
errors.FileUpload.invalidFileUpload =  'Invalid File Upload';

errors.resultUpdate = {};
errors.resultUpdate.invalidGrade = 'Invalid Grade';
errors.resultUpdate.invalidSem = 'Invalid Sem Value';
errors.resultUpdate.invalidSubjectCode = 'Invalid Subject Code';

module.exports = errors;

