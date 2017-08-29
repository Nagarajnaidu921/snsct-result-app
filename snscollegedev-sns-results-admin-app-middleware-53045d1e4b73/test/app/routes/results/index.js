'use strict';
const path = require('path');
const chai = require('chai').should();
const errors = require(path.resolve('./helpers/errors'));
const Student = require(path.resolve('./app/models')).Student;
const Result = require(path.resolve('./app/models')).Result;

const supertest = require('supertest');
require(path.resolve('./server'));

const request = supertest('http://localhost:3000');

describe('Results API', () => {
    function onBefore(done) {
        const students = require('./data-files/students.json');
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

    describe('#upload', () => {

        it('should extract, transform and insert uploaded results into db, without any error', done => {
            const resultsFile = path.resolve(__dirname, './data-files/results-valid.xlsx');

            request.post('/api/results/upload/')
                .attach('results', resultsFile)
                .expect(200)
                .end(function(error, res) {
                    if (error) return done(error);
                    res.body.should.be.an('object');
                    res.body.should.have.property('isSuccess', true);
                    res.body.should.have.property('results').and.to.be.an('array');
                    res.body.results.forEach(result => result.should.have.all.keys('id', 'studentId', 'sem', 'subjectCode', 'grade'));
                    done();
                })

        })

        function assertResponse(error, res, message, done) {
            if (error) return done(error);
            res.body.should.be.an('object');
            res.body.should.have.property('isSuccess', false);
            res.body.should.have.property('message', 'Bad Request: ' + message);
            done();
        }

        it('should fail to accept the file if the uploaded file is not xlsx file', done => {
            const resultsFile = path.resolve(__dirname, './data-files/results-valid.csv');

            request.post('/api/results/upload/')
                .attach('results', resultsFile)
                .expect(200)
                .end(function(error, res) {
                    const message = errors.results.FileUpload.invalidFileUpload;
                    assertResponse(error, res, message, done);
                })

        })

        it('should fail if uploaded data contains invaid register numbers', done => {
            const resultsFile = path.resolve(__dirname, './data-files/results-invalid-reg-number.xlsx');

            request.post('/api/results/upload/')
                .attach('results', resultsFile)
                .expect(200)
                .end(function(error, res) {
                    const message = errors.results.FileUpload.invalidRegisterNumbers;
                    assertResponse(error, res, message, done);
                })

        })

        it('should fail if uploaded data contains unknown register numbers', done => {
            const resultsFile = path.resolve(__dirname, './data-files/results-invalid-unknown-reg-number.xlsx');

            request.post('/api/results/upload/')
                .attach('results', resultsFile)
                .expect(200)
                .end(function(error, res) {
                    const message = errors.results.FileUpload.unknownRegisterNumbers;
                    assertResponse(error, res, message, done);
                })

        })

        it('should fail if uploaded data contains invalid grades', done => {
            const resultsFile = path.resolve(__dirname, './data-files/results-invalid-grade.xlsx');

            request.post('/api/results/upload/')
                .attach('results', resultsFile)
                .expect(200)
                .end(function(error, res) {
                    const message = errors.results.FileUpload.invalidGrades;
                    assertResponse(error, res, message, done);
                })

        })


        it('should fail if uploaded data contains invalid subject codes', done => {
            const resultsFile = path.resolve(__dirname, './data-files/results-invalid-subject-code.xlsx');

            request.post('/api/results/upload/')
                .attach('results', resultsFile)
                .expect(200)
                .end(function(error, res) {
                    const message = errors.results.FileUpload.invalidSubjectCodes;
                    assertResponse(error, res, message, done);
                })

        })

        it('should fail if uploaded data contains invalid sem values', done => {
            const resultsFile = path.resolve(__dirname, './data-files/results-invalid-sem.xlsx');

            request.post('/api/results/upload/')
                .attach('results', resultsFile)
                .expect(200)
                .end(function(error, res) {
                    const message = errors.results.FileUpload.invalidSemValues;
                    assertResponse(error, res, message, done);
                })

        })
    })

    // Search On Results
    describe('#Search', () => {

        it('should take student\'s register number and return results without any errors', done => {
            const registerNumber = '17ec001'
            request.get('/api/results/search/')
                .query({ registerNumber })
                .expect(200)
                .end(function(error, res) {
                    if (error) return done(error);
                    res.body.should.be.an('object');
                    res.body.should.have.property('isSuccess', true);
                    res.body.should.have.property('student').and.to.be.an('object');
                    res.body.student.should.have.all.keys('id', 'registerNumber', 'email', 'fullName', 'gender', 'isActive');
                    res.body.student.should.have.property('registerNumber', registerNumber);
                    res.body.student.should.have.property('isActive', true);
                    res.body.should.have.property('results').and.to.be.an('array');
                    done();
                })
        });

        it('should respond with failed response if given student\'s register number not exist', done => {
            const registerNumber = '17ec101'
            request.get('/api/results/search/')
                .query({ registerNumber })
                .expect(200)
                .end(function(error, res) {
                    if (error) return done(error);
                    res.body.should.be.an('object');
                    res.body.should.have.property('isSuccess', false);
                    const message = 'Bad Request: Student Id Doesn\'t Exist';
                    res.body.should.have.property('message', message);
                    done();
                })
        });

        it('should respond with failed response if given student\'s register number is not valid', done => {
            const registerNumber = '17xy101'
            request.get('/api/results/search/')
                .query({ registerNumber })
                .expect(200)
                .end(function(error, res) {
                    if (error) return done(error);
                    res.body.should.be.an('object');
                    res.body.should.have.property('isSuccess', false);
                    const message = 'Bad Request: Invalid Student Id';
                    res.body.should.have.property('message', message);
                    done();
                })
        });

    })

    // CRUD On Results
    describe('#CRUD OPERATION On Single Result Doc', () => {
        it('should successfully update result with given id', done => {
            Result.find({}).exec()
                .then(results => {
                    const id = (results[0] || {}).id;
                    const grade = 'C';
                    const sem = 3;
                    request.put(`/api/results/${id}`)
                        .send({ grade, sem })
                        .expect(200)
                        .end(function(error, res) {
                            if (error) return done(error);

                            res.body.should.be.an('object');
                            res.body.should.have.property('isSuccess', true);
                            res.body.should.have.property('result').to.be.an('object');
                            res.body.result.should.be.a('object').to.have.all.keys('id', 'studentId', 'sem', 'subjectCode', 'grade');
                            res.body.result.should.have.property('grade', grade);
                            res.body.result.should.have.property('sem', sem);
                            done();
                        })
                })
        });

        it('should fail to update if the grade is invalid', done => {
            Result.find({}).exec()
                .then(results => {
                    const id = (results[0] || {}).id;
                    const grade = 'L';
                    request.put(`/api/results/${id}`)
                        .send({ grade })
                        .expect(200)
                        .end(function(error, res) {
                            if (error) return done(error);

                            res.body.should.be.an('object');
                            res.body.should.have.property('isSuccess', false);
                            const message = `Bad Request: ${errors.results.resultUpdate.invalidGrade}`;
                            res.body.should.have.property('message', message);
                            done();
                        })
                })
        });

        it('should fail to update if the sem is invalid', done => {
            Result.find({}).exec()
                .then(results => {
                    const id = (results[0] || {}).id;
                    const sem = '9';
                    request.put(`/api/results/${id}`)
                        .send({ sem })
                        .expect(200)
                        .end(function(error, res) {
                            if (error) return done(error);

                            res.body.should.be.an('object');
                            res.body.should.have.property('isSuccess', false);
                            const message = `Bad Request: ${errors.results.resultUpdate.invalidSem}`;
                            res.body.should.have.property('message', message);
                            done();
                        })
                })
        });

        it('should fail to update if the subject code is invalid', done => {
            Result.find({}).exec()
                .then(results => {
                    const id = (results[0] || {}).id;
                    const subjectCode = 'XY123';
                    request.put(`/api/results/${id}`)
                        .send({ subjectCode })
                        .expect(200)
                        .end(function(error, res) {
                            if (error) return done(error);

                            res.body.should.be.an('object');
                            res.body.should.have.property('isSuccess', false);
                            const message = `Bad Request: ${errors.results.resultUpdate.invalidSubjectCode}`;
                            res.body.should.have.property('message', message);
                            done();
                        })
                })
        });

        it('should successfully delete result with given id', done => {
            Result.find({}).exec()
                .then(results => {
                    const id = (results[0] || {}).id;
                    request.delete(`/api/results/${id}`)
                        .expect(200)
                        .end(function(error, res) {
                            if (error) return done(error);

                            res.body.should.be.an('object');
                            res.body.should.have.property('isSuccess', true);
                            res.body.should.have.property('result').to.be.an('object').and.not.to.be.null;
                            done();
                        })
                })
        });
    })
})