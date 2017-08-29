'use strict';

const validStudent = {
    registerNumber: '17it110',
    fullName: 'Yuvaraj V',
    email: 'shivarajnaidu@gmail.com',
    password: 'yuvaraj',
    gender: 'm'
};

const invalidStudent = {};

invalidStudent.withOutId = {
    fullName: 'Yuvaraj V',
    email: 'shivarajnaidu@gmail.com',
    password: 'yuvaraj',
    gender: 'm'
};

invalidStudent.withOutFullName = {
    registerNumber: '17it110',
    email: 'shivarajnaidu@gmail.com',
    password: 'yuvaraj',
    gender: 'm'
};

invalidStudent.withOutEmail = {
    registerNumber: '17it110',
    fullName: 'Yuvaraj V',
    password: 'yuvaraj',
    gender: 'm'
};

invalidStudent.withOutPassword = {
    registerNumber: '17it110',
    fullName: 'Yuvaraj V',
    email: 'shivarajnaidu@gmail.com',
    gender: 'm'
};

invalidStudent.withOutGender = {
    registerNumber: '17it110',
    fullName: 'Yuvaraj V',
    email: 'shivarajnaidu@gmail.com',
    password: 'yuvaraj'
};

invalidStudent.withUnknownGender = {
    registerNumber: '17it110',
    fullName: 'Yuvaraj V',
    email: 'shivarajnaidu@gmail.com',
    password: 'yuvaraj',
    gender: 'XYZ'
};


function getValidStudent() {
    return validStudent;
}

function getInvalidStudent(key) {
    if ('fullName' === key) {
        return Object.assign({}, invalidStudent.withOutFullName);
    }

    if ('registerNumber' === key) {
        return Object.assign({}, invalidStudent.withOutId);
    }

    if ('email' === key) {
        return Object.assign({}, invalidStudent.withOutEmail);
    }

    if ('password' === key) {
        return Object.assign({}, invalidStudent.withOutPassword);
    }

    if ('gender' === key) {
        return Object.assign({}, invalidStudent.withOutGender);
    }

    if ('unknown-gender' === key) {
        return Object.assign({}, invalidStudent.withUnknownGender);
    }
}

module.exports = { getValidStudent, getInvalidStudent };
