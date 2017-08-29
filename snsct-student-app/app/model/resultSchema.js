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


const Student = mongoose.model('Result', ResultSchema);
module.exports = Student;
