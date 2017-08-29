'use strict';

const validAdmin = {
    fullName: 'Yuvaraj V',
    email: 'shivarajnaidu@gmail.com',
    password: 'yuvaraj'
};

const invalidAdmin = {};
invalidAdmin.withOutFullName = {
    email: 'shivarajnaidu@gmail.com',
    password: 'yuvaraj'
};

invalidAdmin.withOutEmail = {
    fullName: 'Yuvaraj V',
    password: 'yuvaraj'
};

invalidAdmin.withOutPassword = {
    fullName: 'Yuvaraj V',
    email: 'shivarajnaidu@gmail.com',
};

function getValidAdmin() {
    return validAdmin;
}

function getInvalidAdmin(key) {
    if ('fullName' === key) {
        return Object.assign({}, invalidAdmin.withOutFullName);
    }

    if ('email' === key) {
        return Object.assign({}, invalidAdmin.withOutEmail);
    }

    if ('password' === key) {
        return Object.assign({}, invalidAdmin.withOutPassword);
    }
}

module.exports = { getValidAdmin, getInvalidAdmin };
