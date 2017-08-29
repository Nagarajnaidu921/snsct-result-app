'use strict';
const path = require('path');
const errors = require(path.resolve('./helpers/errors'));
const PasswordServ = require('../lib/password');
const TokenServ = require('../lib/token');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const options = { timestamps: true };

const AdminSchema = new Schema({
    id: { type: String, default: uuid },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    isActive: { type: Boolean, default: true }
}, options);


// Will check admin with given Email Id Already Exist or Not;
// If Not Exist This Will Create New One

function createNew({ email, password, fullName }) {
    const self = this;
    return new Promise((resolve, reject) => {
        const isActive = true;
        self.findOne({ email, isActive }).exec()
            .then(admin => {
                if (admin) {
                    // If Admin With Given Email ID Already Exist Throw Error;
                    const error = new Error('Admin With Given User Id Already Exist');
                    reject(error);
                } else {
                    return PasswordServ.hash(password);
                }
            })
            .then(hashedPassword => {
                const password = hashedPassword;
                const admin = new Admin({ email, password, fullName });
                return admin.save()
            })
            .then(resolve)
            .catch(reject)
    });
}


// This Fuction Will Allow Admin Users To Login To System 
// If Provided Email And Password Is Correct
// Upon Successfull Login Will Return Token (JWT)...
function login({ email, password }) {
    const self = this;
    return new Promise((resolve, reject) => {
        const isActive = true;
        self.findOne({ email, isActive }).exec()
            .then(admin => {
                if (admin) {
                    const hashedPassword = admin.password;
                    return PasswordServ.match(password, hashedPassword)
                        .then(isMatched => {
                            if (isMatched) {
                                const role = admin.role;
                                const adminId = admin.id;
                                return TokenServ.generate({ role, adminId });
                            } else {
                                const error = new Error(errors.login.password.wrong);
                                reject(error);
                            }
                        })
                } else {
                    const error = new Error(errors.login.email.wrong);
                    reject(error);
                }
            })
            .then(resolve)
            .catch(reject);
    })
}

function resetPassword({ id, password, options }) {
    const self = this;
    return new Promise((resolve, reject) => {
        const isActive = true;
        PasswordServ.hash(password)
            .then(hashedPassword => self.findOneAndUpdate({ id, isActive: true }, { password: hashedPassword }, { new: true, fields: options }).exec())
            .then(resolve)
            .catch(reject);
    })
}


// Static Method Declarations.. 
AdminSchema.statics.createNew = createNew;
AdminSchema.statics.login = login;
AdminSchema.statics.resetPassword = resetPassword;

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
