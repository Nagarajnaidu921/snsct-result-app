'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');
const PasswordServ = require('../lib/password');
const options = { timestamps: true };

const StudentSchema = new Schema({
    id: { type: String, default: uuid },
    registerNumber: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, options);

function createNew({ registerNumber, fullName, email, gender, password }) {
    const self = this;

    return new Promise((resolve, reject) => {
        const validGenders = ['m', 'f', 'o'];
        const isValidGender = gender && validGenders.includes(gender);

        if (!isValidGender) {
            const error = new Error('Invalid Gender Value');
            reject(error);
        }

        const validIdPattern = /^[1-9][1-9](au|ae|ag|bm|ce|cp|cs|ee|ei|ec|it|mc|me|ma)[0-9][0-9][0-9]$/;
        const isValidRegisterNumber = registerNumber && validIdPattern.test(registerNumber);

        if (!isValidRegisterNumber) {
            const error = new Error('Invalid Register Number');
            reject(error);
        }

        self.findOne({ registerNumber }).exec()
            .then(student => {
                if (student) {
                    const error = new Error('Student With Given Register Number Already Exist');
                    reject(error);
                } else {
                    return PasswordServ.hash(password);
                }
            })
            .then(hashedPassword => {
                const password = hashedPassword;
                const student = new Student({ registerNumber, fullName, email, gender, password });
                return student.save();
            })
            .then(resolve)
            .catch(reject);
    });
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
StudentSchema.statics.createNew = createNew;
StudentSchema.statics.resetPassword = resetPassword;

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
