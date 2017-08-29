'use strict';

const errors = {};

errors.email = {};
errors.email.missing = 'Email Should Not Be Empty';
errors.email.wrong = 'Admin With Given Email Not Found';

errors.password = {};
errors.password.missing = 'Password Should Not Be Empty';
errors.password.wrong = 'Incorrect Password';

module.exports = errors;

