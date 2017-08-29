'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');
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
const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
