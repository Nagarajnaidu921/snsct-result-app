'use strict';

const path = require('path');

// Initialize Database Connections...
const Student = require(path.resolve('./app/models')).Student;

const StudentFactory = require('./factory/student');
const PasswordServ = require(path.resolve('./app/lib/password'));

const chai = require('chai');
chai.should();


describe('Student Model', () => {

    // Clear Student Model Before Each Test..
    beforeEach(done => {
        Student.remove({}, done);
    })

    // After Tests completed should empty the collection
    after(done => {
        Student.remove({}, done);
    })

    //Test cases for #createNew Method in Student Model..
    describe('#createNew', () => {

        it('should encrypt password and save the student details without any errors', done => {
            const validStudent = StudentFactory.getValidStudent();
            Student.createNew(validStudent)
                .then(student => {
                    student.should.have.property('id').and.not.to.be.empty;
                    student.should.have.property('registerNumber', validStudent.registerNumber).and.not.to.be.empty;
                    student.should.have.property('fullName', validStudent.fullName);
                    student.should.have.property('email', validStudent.email);
                    student.should.have.property('gender', validStudent.gender);
                    student.should.have.property('password').and.not.to.be.empty;
                    PasswordServ.match(validStudent.password, student.password)
                        .then(isMatched => {
                            if (isMatched) {
                                done()
                            } else {
                                throw new Error('Passwords Not Matched');
                            }
                        })
                        .catch(done);
                })
                .catch(done);
        });

        it('should fail to create student if student with same id already exist', done => {
            const validStudent = StudentFactory.getValidStudent();

            Student.createNew(validStudent)
                .then(student => {
                    return Student.createNew(validStudent)
                })
                .catch(error => {
                    error.should.be.an.instanceof(Error);
                    error.should.have.property('message', 'Student With Given Register Number Already Exist');
                    done();
                })
        });

        it('should fail to create student if id missing', done => {

            const missingKey = 'registerNumber';
            const invalidStudent = StudentFactory.getInvalidStudent(missingKey);
            Student.createNew(invalidStudent)
                .catch(error => {
                    error.should.be.an.instanceof(Error);
                    error.should.have.property('message', 'Invalid Register Number');
                    done();
                })
        });

        it('should fail to create student if email missing', done => {

            const missingKey = 'email';
            const invalidStudent = StudentFactory.getInvalidStudent(missingKey);
            Student.createNew(invalidStudent)
                .catch(error => {
                    error.errors.should.have.property(missingKey);
                    done();
                })
        });

        it('should fail to create student if fullName missing', done => {

            const missingKey = 'fullName';
            const invalidStudent = StudentFactory.getInvalidStudent(missingKey);
            Student.createNew(invalidStudent)
                .catch(error => {
                    error.errors.should.have.property(missingKey);
                    done();
                })
        });

        it('should fail to create student if password missing', done => {

            const missingKey = 'password';
            const invalidStudent = StudentFactory.getInvalidStudent(missingKey);
            Student.createNew(invalidStudent)
                .catch(error => {
                    error.should.exist;
                    done()
                })
        });

        it('should fail to create student if gender missing', done => {

            const missingKey = 'gender';
            const invalidStudent = StudentFactory.getInvalidStudent(missingKey);
            Student.createNew(invalidStudent)
                .catch(error => {
                    error.should.be.an.instanceof(Error);
                    error.should.have.property('message', 'Invalid Gender Value');
                    done();
                })
        });

        it('should fail to create student if gender is invalid', done => {

            const invalidTypeKey = 'unknown-gender';
            const invalidStudent = StudentFactory.getInvalidStudent(invalidTypeKey);
            Student.createNew(invalidStudent)
                .catch(error => {
                    error.should.be.an.instanceof(Error);
                    error.should.have.property('message', 'Invalid Gender Value');
                    done();
                })
        })

    });
});
