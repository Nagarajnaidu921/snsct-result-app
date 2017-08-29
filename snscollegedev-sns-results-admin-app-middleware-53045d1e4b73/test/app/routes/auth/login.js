'use strict';
const path = require('path');
const chai = require('chai').should();
const errors = require(path.resolve('./helpers/errors'));

const supertest = require('supertest');
require(path.resolve('./server'));

const request = supertest('http://localhost:3000');
const Admin = require(path.resolve('./app/models')).Admin;

const validAdmin = {
    fullName: 'Yuvaraj V',
    email: 'shivarajnaidu@gmail.com',
    password: 'yuvaraj'
};

describe('Login API', () => {
    function onBefore(done) {

        function createAdmin(results) {
            return Admin.createNew(validAdmin);
        }

        Admin.remove({}).exec()
            .then(createAdmin)
            .then(admin => {
                if (admin) {
                    // console.log(admin, 'admin')
                    done()
                } else {
                    throw new Error('Something Went Wrong While Creating New Admin');
                }
            })
            .catch(done)

    }

    function onAfter(done) {
        Admin.remove({}).exec()
            .then(results => done())
            .catch(done);
    }



    before(onBefore);
    after(onAfter);

    function errorObj(message) {
        const obj = { isSuccess: false, message: 'Bad Request: ' + message };
        return obj;
    }

    it('should login successfully and return token with status code 200', done => {
        const { email, password } = validAdmin;

        request.post('/auth/api/login')
            .send({ email, password })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);
                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess').and.to.be.true;
                res.body.should.have.property('token').and.to.be.a('string');
                res.body.should.have.property('message').and.to.be.a('string');
                done();
            });

    })

    it('should fail to login if admin password is missing', done => {
        const invalidAdminLoginDetails = {
            email: validAdmin.email,
            password: ''
        };

        request.post('/auth/api/login')
            .send(invalidAdminLoginDetails)
            .expect(200, errorObj(errors.login.password.missing))
            .end(done);
    })


    it('should fail to login if admin email is missing', done => {
        const invalidAdminLoginDetails = {
            email: '',
            password: validAdmin.password
        };

        request.post('/auth/api/login')
            .send(invalidAdminLoginDetails)
            .expect(200, errorObj(errors.login.email.missing))
            .end(done);
    })

    it('should fail to login if password is wrong', done => {
        const invalidAdminLoginDetails = {
            email: validAdmin.email,
            password: 'xyz123@abcd'
        };

        request.post('/auth/api/login')
            .send(invalidAdminLoginDetails)
            .expect(200, errorObj(errors.login.password.wrong))
            .end(done);
    })

    it('should fail to login if admin with given email not found', done => {
        const invalidAdminLoginDetails = {
            email: 'xyz@example.com',
            password: validAdmin.password
        };

        request.post('/auth/api/login')
            .send(invalidAdminLoginDetails)
            .expect(200, errorObj(errors.login.email.wrong))
            .end(done);
    })

})
