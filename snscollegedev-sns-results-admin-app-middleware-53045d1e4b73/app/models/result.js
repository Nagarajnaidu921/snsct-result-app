'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');
const options = { timestamps: true };

const ResultSchema = new Schema({
    id: { type: String, default: uuid },
    studentId: { type: String, required: true },
    subjectCode: { type: String, required: true },
    grade: { type: String, required: true },
    sem: { type: Number, required: true }
}, options);


// function createNew({ studentId, fullName, email, gender, password }) {
//     const self = this;

//     return new Promise((resolve, reject) => {
//         const validGenders = ['m', 'f', 'o'];
//         const isValidGender = gender && validGenders.includes(gender);

//         if (!isValidGender) {
//             const error = new Error('Invalid Gender Value');
//             reject(error);
//         }

//         const validIdPattern = /^[1-9][1-9](au|ae|ag|bm|ce|cp|cs|ee|ei|ec|it|mc|me|ma)[0-9][0-9][0-9]$/;
//         const isValidStudentId = studentId && validIdPattern.test(studentId);

//         if (!isValidStudentId) {
//             const error = new Error('Invalid Student ID Value');
//             reject(error);
//         }

//         self.findOne({ studentId }).exec()
//             .then(student => {
//                 if (student) {
//                     const error = new Error('Student With Given User Id Already Exist');
//                     reject(error);
//                 } else {
//                     return PasswordServ.hash(password);
//                 }
//             })
//             .then(hashedPassword => {
//                 const password = hashedPassword;
//                 const student = new Student({ studentId, fullName, email, gender, password });
//                 return student.save();
//             })
//             .then(resolve)
//             .catch(reject);
//     });
// }



// // Static Method Declarations.. 
// ResultSchema.statics.createNew = createNew;

const Student = mongoose.model('Result', ResultSchema);
module.exports = Student;
