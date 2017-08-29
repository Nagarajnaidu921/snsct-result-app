'use strict';

const path = require('path');
const NODE_ENV = process.env.NODE_ENV;
const Admin = require(path.resolve('./app/models/')).Admin;
const admins = [];
admins.push({
    email: 'shivarajnaidu@gmail.com',
    fullName: 'Yuvaraj V',
    password: 'yuvaraj'
})

admins.push({
    email: 'nagarajnaidu921@gmail.com',
    fullName: 'Nagaraj V',
    password: 'nagaraj'
})

function seedAdmins() {
    function createAdmin({ email, fullName, password }) {
        return Admin.findOne({ email, isActive: true }).exec()
            .then(admin => {
                if (admin && (NODE_ENV !== 'production')) {
                    return admin.save({ email, fullName, password });
                } else {
                    return Admin.createNew({ email, fullName, password })
                }
            })

    }


    return Promise.all(admins.map(createAdmin));
}


module.exports = seedAdmins;
