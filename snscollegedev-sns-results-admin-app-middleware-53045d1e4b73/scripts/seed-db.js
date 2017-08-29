'use strict';

// Initialize Database Connections...
const path = require('path');
const mongoose = require('mongoose');
const NODE_ENV = process.env.NODE_ENV;
const seedAdmins = require('./seed-admins');
const seedStudents = require('./seed-students');

function seed() {

    seedAdmins()
        .then(admins => {
            console.log(admins);
            return seedStudents()
                // mongoose.connection.close();
        })
        .then(students => {
            console.log(students);
            mongoose.connection.close();
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        })

}

module.exports = { seed };
