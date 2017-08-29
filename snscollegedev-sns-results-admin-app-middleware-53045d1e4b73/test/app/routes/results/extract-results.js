'use strict';
const path = require('path');
const chai = require('chai').should();
const students = require('./data-files/students.json');
const extractResults = require(path.resolve('./app/routes/results/extract-results'));
const errors = require(path.resolve('./helpers/errors'));
const Student = require(path.resolve('./app/models')).Student;

describe('Extract Results API', () => {

    function onBefore(done) {
        Student.insertMany(students, (error, docs) => {
            if (error) {
                return done(error);
            }
            done();
        });
    }



    function onAfter(done) {
        Student.remove({}).exec()
            .then(results => done())
            .catch(done);
    }


    before(onBefore);
    after(onAfter);

    function assertionForFailure(error, message, done) {
        error.should.be.an.instanceof(Error);
        error.should.have.property('message', message);
        done();
    }

    it('should produce error if provided file is not xlsx file', done => {
        const filePath = path.resolve(__dirname, './data-files/results-valid.csv');
        extractResults(filePath)
            .catch(error => {
                const message = errors.results.FileUpload.notXlsx;
                assertionForFailure(error, message, done);
            })
    });

    it('should produce error if file not present in given path', done => {
        const filePath = path.resolve(__dirname, './data-files/results.xlsx');
        extractResults(filePath)
            .catch(error => {
                const message = errors.results.FileUpload.fileNotExist;
                assertionForFailure(error, message, done);
            })
    });

    it('should produce error if uploaded data contains invaid register numbers', done => {
        const filePath = path.resolve(__dirname, './data-files/results-invalid-reg-number.xlsx');
        extractResults(filePath)
            .catch(error => {
                const message = errors.results.FileUpload.invalidRegisterNumbers;
                assertionForFailure(error, message, done);
            })
    });

    it('should produce error if uploaded data contains unknown register numbers', done => {
        const filePath = path.resolve(__dirname, './data-files/results-invalid-unknown-reg-number.xlsx');
        extractResults(filePath)
            .catch(error => {
                const message = errors.results.FileUpload.unknownRegisterNumbers;
                assertionForFailure(error, message, done);
            })
    });

    it('should produce error if uploaded data contains invalid grades', done => {
        const filePath = path.resolve(__dirname, './data-files/results-invalid-grade.xlsx');
        extractResults(filePath)
            .catch(error => {
                const message = errors.results.FileUpload.invalidGrades;
                assertionForFailure(error, message, done);
            })
    });

    it('should produce error if uploaded data contains invalid subject codes', done => {
        const filePath = path.resolve(__dirname, './data-files/results-invalid-subject-code.xlsx');
        extractResults(filePath)
            .catch(error => {
                const message = errors.results.FileUpload.invalidSubjectCodes;
                assertionForFailure(error, message, done);
            })
    });

    it('should produce error if uploaded data contains invalid sem values', done => {
        const filePath = path.resolve(__dirname, './data-files/results-invalid-sem.xlsx');
        extractResults(filePath)
            .catch(error => {
                const message = errors.results.FileUpload.invalidSemValues;
                assertionForFailure(error, message, done);
            })
    });

    it('should return results successfully in required format', done => {
        const filePath = path.resolve(__dirname, './data-files/results-valid.xlsx');
        extractResults(filePath)
            .then(results => {
                results.should.be.an.instanceof(Array);
                results.forEach(result => result.should.have.all.keys('studentId', 'sem', 'subjectCode', 'grade'));
                done()
            })
    });

});