'use strict';

const path = require('path');
const NODE_ENV = process.env.NODE_ENV;
const Student = require(path.resolve('./app/models/')).Student;
const students = [];
students.push({
    registerNumber: '17it100',
    fullName: 'Yuvaraj V',
    email: 'shivarajnaidu@gmail.com',
    password: 'yuvaraj',
    gender: 'm'
})

students.push({
    registerNumber: '14it019',
    fullName: 'Nagaraj V',
    email: 'nagarajnaidu921@gmail.com',
    password: 'nagaraj',
    gender: 'm'
})


function seedStudents() {
    function createStudent({ registerNumber, email, fullName, password, gender }) {
        return Student.findOne({ email, isActive: true }).exec()
            .then(student => {
                if (student && (NODE_ENV !== 'production')) {
                    return student.save({ registerNumber, email, fullName, password, gender });
                } else {
                    return Student.createNew({ registerNumber, email, fullName, password, gender });
                }
            })

    }


    return Promise.all(students.map(createStudent));
}


module.exports = seedStudents;
