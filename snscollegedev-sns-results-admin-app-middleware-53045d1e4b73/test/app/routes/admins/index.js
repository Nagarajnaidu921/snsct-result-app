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

const validAdmin2 = {
    fullName: 'Shivaraj V',
    email: 'shivarajnaidu@outlook.com',
    password: 'yuvaraj'
};

let adminID;

describe('Admins API', () => {
    function onBefore(done) {

        function createAdmin(results) {
            return Admin.createNew(validAdmin);
        }

        Admin.remove({}).exec()
            .then(createAdmin)
            .then(admin => {
                if (admin) {
                    adminID = admin.id;
                    return Admin.createNew(validAdmin2);

                    // console.log(admin, 'admin')
                    // done()
                } else {
                    throw new Error('Something Went Wrong While Creating New Admin');
                }
            })
            .then(admin => {
                if (admin) {
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

    it('should return admin with given id', done => {
        const id = adminID;

        request.get(`/api/admins/${id}`)
            .send()
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('admin').to.be.an('object');
                res.body.admin.should.be.a('object').to.have.all.keys('id', 'email', 'fullName', 'isActive');
                res.body.admin.should.be.a('object').to.have.property('isActive', true);

                done();
            })

    })

    it('should reset password of admin with given id', done => {
        const id = adminID;

        request.put(`/api/admins/${id}`)
            .send({ password: 'YuvarajABC' })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('admin').to.be.an('object');
                res.body.admin.should.be.a('object').to.have.all.keys('id', 'email', 'fullName', 'isActive');
                res.body.admin.should.be.a('object').to.have.property('isActive', true);
                done();
            })

    })

    it('should update fullName of admin with given id', done => {
        const id = adminID;
        const fullName = 'Yuvaraj Vemula';

        request.put(`/api/admins/${id}`)
            .send({ fullName })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('admin').to.be.an('object');
                res.body.admin.should.be.a('object').to.have.all.keys('id', 'email', 'fullName', 'isActive');
                res.body.admin.should.be.a('object').to.have.property('isActive', true);
                res.body.admin.should.have.property('fullName', fullName);
                res.body.admin.should.have.property('email').not.to.be.empty;
                done();
            })

    })

    it('should update email of admin with given id', done => {
        const id = adminID;
        const email = 'yuva@gmail.com';

        request.put(`/api/admins/${id}`)
            .send({ email })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('admin').to.be.an('object');
                res.body.admin.should.be.a('object').to.have.all.keys('id', 'email', 'fullName', 'isActive');
                res.body.admin.should.be.a('object').to.have.property('isActive', true);
                res.body.admin.should.have.property('email', email);
                res.body.admin.should.have.property('fullName').not.to.be.empty;
                done();
            })

    })

    it('should update fullName And email of admin with given id', done => {
        const id = adminID;
        const fullName = 'Yuvaraj V';
        const email = 'yuva123@gmail.com';

        request.put(`/api/admins/${id}`)
            .send({ email, fullName })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('admin').to.be.an('object');
                res.body.admin.should.be.a('object').to.have.all.keys('id', 'email', 'fullName', 'isActive');
                res.body.admin.should.be.a('object').to.have.property('isActive', true);
                res.body.admin.should.have.property('email', email);
                res.body.admin.should.have.property('fullName', fullName);
                done();
            })
    })

    it('should fail to update email of admin if admin with given email id already exist', done => {
        const id = adminID;
        const fullName = 'Yuvaraj V';
        const email = 'shivarajnaidu@outlook.com';

        request.put(`/api/admins/${id}`)
            .send({ email, fullName })
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);
                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', false);
                res.body.should.have.property('message', 'Bad Request: Admin With This Email ID Already Exist');
                done();
            });
    })

    it('should deactivate/delete admin with given id', done => {

        const id = adminID;

        request.delete(`/api/admins/${id}`)
            .send()
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('admin').to.be.an('object');
                res.body.admin.should.be.a('object').to.have.all.keys('id', 'email', 'fullName', 'isActive');
                res.body.admin.should.be.a('object').to.have.property('isActive', false);

                done();
            })

    })

    it('should create admin with given data', done => {

        request.post('/api/admins')
            .send(validAdmin)
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);

                res.body.should.be.an('object');
                res.body.should.have.property('isSuccess', true);
                res.body.should.have.property('admin').to.be.an('object');
                res.body.admin.should.be.a('object').to.have.all.keys('id', 'email', 'fullName', 'isActive');
                res.body.admin.should.be.a('object').to.have.property('isActive', true);

                done();
            })
    })

    it('should return list of admins', done => {
        request.get('/api/admins')
            .send()
            .expect(200)
            .end(function(error, res) {
                if (error) return done(error);
                res.body.should.be.an('object');
                res.body.should.have.property('admins').and.to.be.an.instanceof(Array)
                res.body.should.have.property('admins').to.have.lengthOf(2);
                res.body.admins[0].should.be.a('object').to.have.all.keys('id', 'email', 'fullName', 'isActive');
                res.body.admins[0].should.be.a('object').to.have.property('isActive', true);
                done();
            });

    })

    it('should return empty array for list of admins', done => {
        Admin.remove({}).exec()
            .then(results => {
                request.get('/api/admins')
                    .send()
                    .expect(200)
                    .end(function(error, res) {
                        if (error) return done(error);
                        res.body.should.be.an('object');
                        res.body.should.have.property('admins').and.to.be.an.instanceof(Array)
                        res.body.should.have.property('admins').to.be.empty;
                        done();
                    });
            })
            .catch(done);
    })


})
