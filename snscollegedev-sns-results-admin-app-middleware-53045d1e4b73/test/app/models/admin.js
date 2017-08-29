'use strict';

const path = require('path');
const errors = require(path.resolve('./helpers/errors'));

// Initialize Database Connections...
const Admin = require(path.resolve('./app/models')).Admin;

const AdminFactory = require('./factory/admin');
const PasswordServ = require(path.resolve('./app/lib/password'));

const chai = require('chai');
chai.should();


describe('Admin Model', () => {

    // Clear Admin Model Before Each Test..
    beforeEach(done => {
        Admin.remove({}, done);
    })

    // After Tests completed should empty the collection
    after(done => {
        Admin.remove({}, done);
    })


    //Test cases for #createNew Method in Admin Model..
    describe('#createNew', () => {
        it('should encrypt password and save admin document without any error', done => {
            const validAdmin = AdminFactory.getValidAdmin();

            Admin.createNew(validAdmin)
                .then(admin => {
                    admin.should.have.property('id').and.not.to.be.empty;
                    admin.should.have.property('role', 'admin');
                    admin.should.have.property('fullName', validAdmin.fullName);
                    admin.should.have.property('email', validAdmin.email);
                    admin.should.have.property('password').and.not.to.be.empty;
                    admin.should.have.property('isActive', true);
                    PasswordServ.match(validAdmin.password, admin.password)
                        .then(isMatched => {
                            if (isMatched) {
                                done()
                            } else {
                                throw new Error('Passwords Not Matched');
                            }
                        })
                        .catch(done);
                })
        });

        it('should fail to create admin if admin with given email already exist', done => {
            const validAdmin = AdminFactory.getValidAdmin();

            Admin.createNew(validAdmin)
                .then(admin => {
                    return Admin.createNew(validAdmin)
                })
                .catch(error => {
                    error.should.be.an.instanceof(Error);
                    error.should.have.property('message', 'Admin With Given User Id Already Exist');
                    done();
                })
        });

        it('should fail to create admin without fullName', done => {
            const missingKey = 'fullName';
            const invalidAdmin = AdminFactory.getInvalidAdmin(missingKey);
            Admin.createNew(invalidAdmin)
                .catch(error => {
                    error.errors.should.have.property(missingKey)
                    done()
                })
        });

        it('should fail to create admin without email', done => {
            const missingKey = 'email';
            const invalidAdmin = AdminFactory.getInvalidAdmin(missingKey);
            Admin.createNew(invalidAdmin)
                .catch(error => {
                    error.errors.should.have.property(missingKey);
                    done();
                })
        });

        it('should fail to create admin without password', done => {
            const missingKey = 'password';
            const invalidAdmin = AdminFactory.getInvalidAdmin(missingKey);
            Admin.createNew(invalidAdmin)
                .catch(error => {
                    error.should.exist;
                    done()
                })
        });

    })

    // Tests For #login method
    describe('#login', () => {

        it('should login successfully(without any error) and return token', done => {
            const validAdmin = AdminFactory.getValidAdmin();

            Admin.createNew(validAdmin)
                .then(admin => Admin.login(validAdmin))
                .then(token => {
                    token.should.be.a('string').and.not.be.empty;
                    done()
                })
        })

        it('should fail to login if admin accout is not active', done => {
            const validAdmin = AdminFactory.getValidAdmin();
            const email = validAdmin.email;
            const password = validAdmin.password;

            Admin.createNew(validAdmin)
                .then(admin => Admin.findOneAndUpdate({ email }, { isActive: false }))
                .then(admin => Admin.login({ email, password }))
                .catch(error => {
                    error.should.be.instanceof(Error);
                    error.should.have.property('message', errors.login.email.wrong);
                    done();
                })
        })

        it('should fail to login if email not exist', done => {
            const validAdmin = AdminFactory.getValidAdmin();
            Admin.login(validAdmin)
                .catch(error => {
                    error.should.be.instanceof(Error);
                    error.should.have.property('message', errors.login.email.wrong);
                    done();
                })
        })

        it('should fail to login if password not matched', done => {
            const validAdmin = AdminFactory.getValidAdmin();
            const email = validAdmin.email;
            const password = 'xyz12345678';

            Admin.createNew(validAdmin)
                .then(admin => Admin.login({ email, password }))
                .catch(error => {
                    error.should.be.instanceof(Error);
                    error.should.have.property('message', errors.login.password.wrong);
                    done();
                })
        })


    });


    // Test cases for reset password method
    describe('#resetPassword', () => {
        it('should reset password successfully without any error', done => {
            const validAdmin = AdminFactory.getValidAdmin();
            const newPassword = 'yuvaraj123';
            const options = {
                id: true,
                email: true,
                fullName: true,
                isActive: true,
                role: true,
                password: true // Retriving Password Field For Test Purpose
            };

            Admin.createNew(validAdmin)
                .then(admin => Admin.resetPassword({ id: admin.id, password: newPassword, options }))
                .then(admin => {
                    admin.should.have.property('id').and.not.to.be.empty;
                    admin.should.have.property('role', 'admin');
                    admin.should.have.property('fullName', validAdmin.fullName);
                    admin.should.have.property('email', validAdmin.email);
                    admin.should.have.property('password').and.not.to.be.empty;
                    admin.should.have.property('isActive', true);
                    return PasswordServ.match(newPassword, admin.password)
                })
                .then(isMatched => {
                            if (isMatched) {
                                done()
                            } else {
                                throw new Error('Passwords Not Matched');
                            }
                        })
                .catch(done)
        })
    })

    // End
});
