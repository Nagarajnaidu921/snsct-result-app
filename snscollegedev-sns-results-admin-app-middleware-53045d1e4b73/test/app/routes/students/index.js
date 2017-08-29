'use strict';
const path = require('path');
const chai = require('chai').should();
const errors = require(path.resolve('./helpers/errors'));

const supertest = require('supertest');
require(path.resolve('./server'));

const request = supertest('http://localhost:3000');
const Student = require(path.resolve('./app/models')).Student;

const validStudent = {
    registerNumber: '14it023',
    fullName: 'Yuvaraj V',
    gender: 'm',
    email: 'shivarajnaidu@gmail.com',
    password: 'yuvaraj'
};

const validStudent2 = {
    registerNumber: '14it024',
    fullName: 'Shivaraj V',
    gender: 'm',
    email: 'shivarajnaidu@outlook.com',
    password: 'yuvaraj'
};

const validStudent3 = {
    registerNumber: '14it025',
    fullName: 'Shivaraj V',
    gender: 'm',
    email: 'shivarajnaidu@xyz.com',
    password: 'yuvaraj'
};

let studentDocID;

describe('Students API', () => {
    function onBefore(done) {

        function createStudent(results) {
            return Student.createNew(validStudent);
        }

        Student.remove({}).exec()
            .then(createStudent)
            .then(student => {
                if (student) {
                    studentDocID = student.id;
                    return Student.createNew(validStudent2);
                } else {
                    throw new Error('Something Went Wrong While Creating New Student');
                }
            })
            .then(student => {
                if (student) {
                    done()
                } else {
                    throw new Error('Something Went Wrong While Creating New Student');
                }
            })
            .catch(done)

    }

    function onAfter(done) {
        Student.remove({}).exec()
            .then(results => done())
            .catch(done);
    }



    before(onBefore);
    after(onAfter);
    const keys = ['id', 'registerNumber', 'email', 'fullName', 'isActive', 'gender'];

    it('should return student with given id', done => {
        const id = studentDocID;

        request.get(`/api/students/${id}`)
            .send()
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);
                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('student').to.be.an('object');
                res.body.student.should.be.a('object').to.have.all.keys(keys);
                res.body.student.should.be.a('object').to.have.property('isActive', true);
                done();
            })

    })

    it('should reset password of student with given id', done => {
        const id = studentDocID;

        request.put(`/api/students/${id}`)
            .send({ password: 'YuvarajABC' })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('student').to.be.an('object');
                res.body.student.should.be.a('object').to.have.all.keys(keys);
                res.body.student.should.be.a('object').to.have.property('isActive', true);
                done();
            })

    })

    it('should update fullName of student with given id', done => {
        const id = studentDocID;
        const fullName = 'Yuvaraj Vemula';

        request.put(`/api/students/${id}`)
            .send({ fullName })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('student').to.be.an('object');
                res.body.student.should.be.a('object').to.have.all.keys(keys);
                res.body.student.should.be.a('object').to.have.property('isActive', true);
                res.body.student.should.have.property('fullName', fullName);
                res.body.student.should.have.property('email').not.to.be.empty;
                res.body.student.should.have.property('gender').not.to.be.empty;
                done();
            })
    })

    it('should update email of student with given id', done => {
        const id = studentDocID;
        const email = 'yuva123xyz@gmail.com';

        request.put(`/api/students/${id}`)
            .send({ email })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('student').to.be.an('object');
                res.body.student.should.be.a('object').to.have.all.keys(keys);
                res.body.student.should.be.a('object').to.have.property('isActive', true);
                res.body.student.should.have.property('email', email);
                res.body.student.should.have.property('fullName').not.to.be.empty;
                res.body.student.should.have.property('gender').not.to.be.empty;
                done();
            })

    })

    it('should update gender of student with given id', done => {
        const id = studentDocID;
        const gender = 'f';

        request.put(`/api/students/${id}`)
            .send({ gender })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('student').to.be.an('object');
                res.body.student.should.be.a('object').to.have.all.keys(keys);
                res.body.student.should.be.a('object').to.have.property('isActive', true);
                res.body.student.should.have.property('gender', gender);
                res.body.student.should.have.property('fullName').not.to.be.empty;
                res.body.student.should.have.property('email').not.to.be.empty;
                done();
            })

    })

    it('should update fullName And email of student with given id', done => {
        const id = studentDocID;
        const fullName = 'Yuvaraj V';
        const email = 'yuva123@gmail.com';

        request.put(`/api/students/${id}`)
            .send({ email, fullName })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('student').to.be.an('object');
                res.body.student.should.be.a('object').to.have.all.keys(keys);
                res.body.student.should.be.a('object').to.have.property('isActive', true);
                res.body.student.should.have.property('email', email);
                res.body.student.should.have.property('fullName', fullName);
                done();
            })
    })

    it('should fail with error response if no updates provided', done => {
        const id = studentDocID;

        request.put(`/api/students/${id}`)
            .send({})
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);
                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', false);
                res.body.should.have.property('message', 'Bad Request: No Update Params');
                done();
            });
    })


    it('should fail to update email of student if student with given email id already exist', done => {
        const id = studentDocID;
        const fullName = 'Yuvaraj V';
        const email = 'shivarajnaidu@outlook.com';

        request.put(`/api/students/${id}`)
            .send({ email, fullName })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);
                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', false);
                res.body.should.have.property('message', 'Bad Request: Student With This Email ID Already Exist');
                done();
            });
    })

    it('should deactivate/delete student with given id', done => {

        const id = studentDocID;
        request.delete(`/api/students/${id}`)
            .send()
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('student').to.be.an('object');
                res.body.student.should.be.a('object').to.have.all.keys(keys);
                res.body.student.should.be.a('object').to.have.property('isActive', false);

                done();
            })

    })

    it('should create student with given data', done => {

        request.post('/api/students')
            .send(validStudent3)
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);
                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('student').to.be.an('object');
                res.body.student.should.be.a('object').to.have.all.keys(keys);
                res.body.student.should.be.a('object').to.have.property('isActive', true);

                done();
            })
    })

    it('should return list of students', done => {
        request.get('/api/students')
            .send()
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);
                res.body.should.be.an('object');
                res.body.should.have.property('students').and.to.be.an.instanceof(Array)
                res.body.should.have.property('students').to.have.lengthOf(2);
                res.body.students[0].should.be.a('object').to.have.all.keys(keys);
                res.body.students[0].should.be.a('object').to.have.property('isActive', true);
                done();
            });

    })

    it('should return empty array for list of students', done => {
        Student.remove({}).exec()
            .then(results => {
                request.get('/api/students')
                    .send()
                    .expect(200)
                    .end(function(error, res) {
                        if (error) return done(error);
                        res.body.should.be.an('object');
                        res.body.should.have.property('students').and.to.be.an.instanceof(Array)
                        res.body.should.have.property('students').to.be.empty;
                        done();
                    });
            })
            .catch(done);
    })


})
